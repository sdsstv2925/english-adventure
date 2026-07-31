(() => {
  if (window.__eaScene18V76Installed) return;
  window.__eaScene18V76Installed = true;

  const SONG_URL = '/audio/voice-boy-2/roy-song.mp3?v=76';
  const OUTPUT_DURATION = 17.5;
  let activeContext = null;
  let activeSource = null;
  let activeTimer = null;
  let renderingPromise = null;

  const lyricLines = [
    { start: 0.0, end: 1.25, text: '♪ Listen to Roy’s song! ♪' },
    { start: 1.25, end: 3.45, text: 'What’s your name? What’s your name?' },
    { start: 3.45, end: 5.95, text: 'What’s your name, little boy?' },
    { start: 5.95, end: 7.65, text: 'My name is Roy.' },
    { start: 7.65, end: 10.15, text: 'How old are you? How old are you?' },
    { start: 10.15, end: 12.45, text: 'How old are you?' },
    { start: 12.45, end: 16.85, text: 'I am six, I am six, and you?' },
    { start: 16.85, end: 17.5, text: '♪' }
  ];

  const melody = [
    0, 0, 3, 3, 5, 3, 0, -2,
    0, 0, 3, 5, 7, 5, 3, 0,
    3, 3, 5, 7, 5, 3, 0, 3,
    5, 7, 9, 7
  ];

  const stopPlayback = () => {
    if (activeTimer) {
      window.clearInterval(activeTimer);
      activeTimer = null;
    }
    if (activeSource) {
      try { activeSource.stop(); } catch {}
      activeSource = null;
    }
    if (activeContext) {
      activeContext.close().catch(() => {});
      activeContext = null;
    }
  };

  const makeImpulse = (context, seconds = 0.8, decay = 2.5) => {
    const length = Math.floor(context.sampleRate * seconds);
    const impulse = context.createBuffer(2, length, context.sampleRate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  };

  const scheduleInstrument = (context, destination, duration) => {
    const tempo = 96;
    const beat = 60 / tempo;
    const chords = [
      [60, 64, 67],
      [57, 60, 64],
      [65, 69, 72],
      [67, 71, 74]
    ];
    const midiToHz = midi => 440 * Math.pow(2, (midi - 69) / 12);

    const musicBus = context.createGain();
    musicBus.gain.value = 0.23;
    musicBus.connect(destination);

    const beatCount = Math.ceil(duration / beat);
    for (let index = 0; index < beatCount; index += 1) {
      const when = index * beat;
      const chord = chords[Math.floor(index / 2) % chords.length];

      chord.forEach((midi, noteIndex) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = noteIndex === 0 ? 'triangle' : 'sine';
        oscillator.frequency.value = midiToHz(midi);
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.exponentialRampToValueAtTime(noteIndex === 0 ? 0.16 : 0.085, when + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + beat * 0.82);
        oscillator.connect(gain).connect(musicBus);
        oscillator.start(when);
        oscillator.stop(Math.min(duration, when + beat * 0.86));
      });

      if (index % 2 === 0) {
        const bass = context.createOscillator();
        const bassGain = context.createGain();
        bass.type = 'sine';
        bass.frequency.value = midiToHz(chord[0] - 12);
        bassGain.gain.setValueAtTime(0.0001, when);
        bassGain.gain.exponentialRampToValueAtTime(0.18, when + 0.012);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, when + beat * 0.72);
        bass.connect(bassGain).connect(musicBus);
        bass.start(when);
        bass.stop(Math.min(duration, when + beat * 0.75));
      }

      const melodyOsc = context.createOscillator();
      const melodyGain = context.createGain();
      melodyOsc.type = 'sine';
      melodyOsc.frequency.value = midiToHz(72 + melody[index % melody.length]);
      melodyGain.gain.setValueAtTime(0.0001, when);
      melodyGain.gain.exponentialRampToValueAtTime(0.055, when + 0.01);
      melodyGain.gain.exponentialRampToValueAtTime(0.0001, when + beat * 0.42);
      melodyOsc.connect(melodyGain).connect(musicBus);
      melodyOsc.start(when);
      melodyOsc.stop(Math.min(duration, when + beat * 0.45));
    }
  };

  const renderSingingBuffer = async () => {
    if (renderingPromise) return renderingPromise;

    renderingPromise = (async () => {
      const response = await fetch(SONG_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Song audio ${response.status}`);
      const encoded = await response.arrayBuffer();

      const DecodeContext = window.AudioContext || window.webkitAudioContext;
      const decodeContext = new DecodeContext();
      const original = await decodeContext.decodeAudioData(encoded.slice(0));
      await decodeContext.close();

      const sampleRate = 32000;
      const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const offline = new Offline(2, Math.ceil(OUTPUT_DURATION * sampleRate), sampleRate);

      const master = offline.createGain();
      master.gain.value = 0.88;
      master.connect(offline.destination);

      const compressor = offline.createDynamicsCompressor();
      compressor.threshold.value = -22;
      compressor.knee.value = 20;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.006;
      compressor.release.value = 0.18;
      compressor.connect(master);

      const voiceDry = offline.createGain();
      voiceDry.gain.value = 0.78;
      voiceDry.connect(compressor);

      const convolver = offline.createConvolver();
      convolver.buffer = makeImpulse(offline);
      const reverbGain = offline.createGain();
      reverbGain.gain.value = 0.22;
      convolver.connect(reverbGain).connect(compressor);

      const grainSize = 0.095;
      const hop = 0.034;
      const beat = 60 / 96;
      const maxRate = Math.pow(2, 9 / 12);
      const maxInputGrain = grainSize * maxRate;
      const inputSpan = Math.max(0.1, original.duration - maxInputGrain - 0.02);

      for (let when = 0; when < OUTPUT_DURATION; when += hop) {
        const noteIndex = Math.min(melody.length - 1, Math.floor(when / beat));
        const semitones = melody[noteIndex];
        const rate = Math.pow(2, semitones / 12);
        const inputPosition = Math.min(
          original.duration - maxInputGrain,
          (when / OUTPUT_DURATION) * inputSpan
        );
        const inputDuration = grainSize * rate;

        const source = offline.createBufferSource();
        const envelope = offline.createGain();
        source.buffer = original;
        source.playbackRate.value = rate;
        envelope.gain.setValueAtTime(0.0001, when);
        envelope.gain.exponentialRampToValueAtTime(0.42, when + 0.018);
        envelope.gain.setValueAtTime(0.42, when + grainSize * 0.66);
        envelope.gain.exponentialRampToValueAtTime(0.0001, when + grainSize);
        source.connect(envelope);
        envelope.connect(voiceDry);
        envelope.connect(convolver);
        source.start(when, Math.max(0, inputPosition), inputDuration);
      }

      scheduleInstrument(offline, compressor, OUTPUT_DURATION);
      return offline.startRendering();
    })().catch(error => {
      renderingPromise = null;
      throw error;
    });

    return renderingPromise;
  };

  const unlockChoices = stage => {
    const choices = stage.querySelector('.choice-row');
    if (!choices) return;
    choices.removeAttribute('data-roy-locked');
    choices.classList.add('ea-roy-unlocked', 'ea76-roy-unlocked');

    if (!choices.querySelector('.ea-roy-question')) {
      const question = document.createElement('div');
      question.className = 'ea-roy-question';
      question.textContent = 'How old is Roy?';
      choices.prepend(question);
    }
  };

  const setActiveLyric = (ui, currentTime) => {
    const lines = [...ui.querySelectorAll('.ea76-lyric-line')];
    let active = 0;
    lyricLines.forEach((line, index) => {
      if (currentTime >= line.start && currentTime < line.end) active = index;
    });
    lines.forEach((line, index) => line.classList.toggle('is-active', index === active));
  };

  const playSong = async (stage, ui) => {
    const button = ui.querySelector('.ea76-song-play');
    const status = ui.querySelector('.ea76-song-status');
    const progress = ui.querySelector('.ea76-song-progress > i');

    stopPlayback();
    stage.dataset.roySongStarted = 'true';
    button.disabled = true;
    button.textContent = 'Создаём мелодию…';
    status.textContent = 'Готовим музыкальную версию с пением';
    ui.classList.add('is-loading');

    try {
      const rendered = await renderSingingBuffer();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      activeContext = new AudioContextClass();
      activeSource = activeContext.createBufferSource();
      activeSource.buffer = rendered;
      activeSource.connect(activeContext.destination);

      const startedAt = activeContext.currentTime;
      ui.classList.remove('is-loading');
      ui.classList.add('is-playing');
      button.textContent = '■ Остановить песню';
      button.disabled = false;
      status.textContent = 'Рой поёт с музыкой';

      activeTimer = window.setInterval(() => {
        if (!activeContext) return;
        const elapsed = Math.min(OUTPUT_DURATION, activeContext.currentTime - startedAt);
        setActiveLyric(ui, elapsed);
        progress.style.width = `${(elapsed / OUTPUT_DURATION) * 100}%`;
      }, 90);

      activeSource.onended = () => {
        if (activeTimer) window.clearInterval(activeTimer);
        activeTimer = null;
        activeSource = null;
        ui.classList.remove('is-playing');
        ui.classList.add('is-finished');
        button.textContent = '↻ Спеть ещё раз';
        status.textContent = 'Песня закончилась — ответь на вопрос';
        progress.style.width = '100%';
        unlockChoices(stage);
      };

      activeSource.start();
    } catch (error) {
      console.error('[English Adventure] Roy singing render failed', error);
      ui.classList.remove('is-loading');
      button.disabled = false;
      button.textContent = '▶ Попробовать ещё раз';
      status.textContent = 'Не удалось подготовить музыкальную дорожку';
    }
  };

  const buildUi = stage => {
    const card = stage.querySelector('.song-card');
    const choices = stage.querySelector('.choice-row');
    if (!card || !choices) return;

    stage.classList.add('ea76-scene18-controlled');
    choices.setAttribute('data-roy-locked', 'true');
    choices.classList.remove('ea-roy-unlocked', 'ea76-roy-unlocked');

    [...card.children].forEach(child => {
      if (!child.classList.contains('ea76-song-ui')) child.setAttribute('data-ea76-native-song', 'true');
    });

    let ui = card.querySelector('.ea76-song-ui');
    if (ui) return;

    ui = document.createElement('div');
    ui.className = 'ea76-song-ui';
    ui.innerHTML = `
      <button type="button" class="ea76-song-play" data-roy-song-bound="true">
        ▶ Послушать, как Рой поёт
      </button>
      <div class="ea76-song-status">Детский голос, мелодия и музыка</div>
      <div class="ea76-song-lyrics" aria-live="polite">
        ${lyricLines.map(line => `<div class="ea76-lyric-line">${line.text}</div>`).join('')}
      </div>
      <div class="ea76-song-progress" aria-hidden="true"><i></i></div>
    `;

    ui.querySelector('.ea76-song-play').addEventListener('click', () => {
      if (ui.classList.contains('is-playing')) {
        stopPlayback();
        ui.classList.remove('is-playing');
        ui.querySelector('.ea76-song-play').textContent = '▶ Продолжить песню сначала';
        ui.querySelector('.ea76-song-status').textContent = 'Песня остановлена';
        return;
      }
      playSong(stage, ui);
    });

    card.append(ui);
  };

  const enhance = () => {
    const stage = document.querySelector('.stage.scene-roy');
    if (!stage) {
      stopPlayback();
      return;
    }
    buildUi(stage);
  };

  new MutationObserver(() => window.requestAnimationFrame(enhance)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', enhance, { once: true })
    : enhance();
})();
