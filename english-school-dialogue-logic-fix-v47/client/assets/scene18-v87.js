(() => {
  if (window.__eaScene18V87Installed) return;
  window.__eaScene18V87Installed = true;

  const FALLBACK_AUDIO_URL = '/audio/voice-boy-2/roy-song.mp3?v=87';
  const LYRIC_LINES = [
    'What’s your name? What’s your name?',
    'What’s your name, little boy?',
    'My name is Roy.',
    'How old are you? How old are you?',
    'How old are you?',
    'I am six, I am six, and you?'
  ];

  /*
   * The words are unchanged. The phrases are split only to create a melody.
   * pitch is the Web Speech API voice pitch (0–2), not a replacement text.
   */
  const SONG_PARTS = [
    { text: 'What’s your name?', line: 0, pitch: 1.06, rate: 0.78, chord: 0, gap: 90 },
    { text: 'What’s your name?', line: 0, pitch: 1.22, rate: 0.78, chord: 1, gap: 180 },
    { text: 'What’s your name,', line: 1, pitch: 1.30, rate: 0.76, chord: 2, gap: 60 },
    { text: 'little boy?', line: 1, pitch: 1.12, rate: 0.72, chord: 0, gap: 260 },
    { text: 'My name is Roy.', line: 2, pitch: 1.36, rate: 0.70, chord: 3, gap: 360 },
    { text: 'How old are you?', line: 3, pitch: 1.08, rate: 0.76, chord: 0, gap: 90 },
    { text: 'How old are you?', line: 3, pitch: 1.24, rate: 0.76, chord: 1, gap: 220 },
    { text: 'How old are you?', line: 4, pitch: 1.32, rate: 0.72, chord: 2, gap: 300 },
    { text: 'I am six,', line: 5, pitch: 1.12, rate: 0.70, chord: 0, gap: 80 },
    { text: 'I am six,', line: 5, pitch: 1.30, rate: 0.70, chord: 1, gap: 80 },
    { text: 'and you?', line: 5, pitch: 1.42, rate: 0.66, chord: 3, gap: 500 }
  ];

  const CHORDS = [
    [261.63, 329.63, 392.00], // C
    [293.66, 369.99, 440.00], // Dm
    [329.63, 392.00, 493.88], // Em
    [349.23, 440.00, 523.25]  // F
  ];

  let activeStage = null;
  let activeUtterance = null;
  let fallbackAudio = null;
  let audioContext = null;
  let musicGain = null;
  let hardFinishTimer = null;
  let nextPartTimer = null;
  let generation = 0;

  let state = {
    playing: false,
    finished: false,
    correct: false,
    wrong: '',
    part: 0,
    progress: 0,
    status: 'Нажми, послушай песню и ответь на вопрос'
  };

  const getStage = () => document.querySelector('.stage.scene-roy');
  const getPanel = stage => stage?.querySelector('.ea84-roy-panel');

  const clearTimers = () => {
    if (hardFinishTimer) {
      clearTimeout(hardFinishTimer);
      hardFinishTimer = null;
    }
    if (nextPartTimer) {
      clearTimeout(nextPartTimer);
      nextPartTimer = null;
    }
  };

  const stopSpeech = () => {
    activeUtterance = null;
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  };

  const stopFallback = () => {
    if (!fallbackAudio) return;
    fallbackAudio.onended = null;
    fallbackAudio.onerror = null;
    fallbackAudio.ontimeupdate = null;
    fallbackAudio.pause();
    fallbackAudio.src = '';
    fallbackAudio = null;
  };

  const stopMusic = () => {
    if (!audioContext) return;
    try {
      audioContext.close();
    } catch (_) {}
    audioContext = null;
    musicGain = null;
  };

  const stopAllAudio = () => {
    generation += 1;
    clearTimers();
    stopSpeech();
    stopFallback();
    stopMusic();
  };

  const render = stage => {
    const panel = getPanel(stage);
    if (!panel) return;

    const playButton = panel.querySelector('.ea84-song-play');
    const skipButton = panel.querySelector('.ea84-song-skip');
    const status = panel.querySelector('.ea84-song-status');
    const line = panel.querySelector('.ea84-song-line');
    const bar = panel.querySelector('.ea84-song-progress > i');
    const question = panel.querySelector('.ea84-question');
    const message = panel.querySelector('.ea84-answer-message');

    if (playButton) {
      playButton.textContent = state.playing
        ? '■ Остановить песню'
        : state.finished
          ? '↻ Послушать ещё раз'
          : '▶ Послушать песню Роя';
    }

    if (skipButton) skipButton.hidden = !state.playing;
    if (status) status.textContent = state.status;

    const part = SONG_PARTS[Math.min(state.part, SONG_PARTS.length - 1)];
    if (line) line.textContent = LYRIC_LINES[part?.line ?? 0];
    if (bar) bar.style.width = `${state.finished ? 100 : Math.max(0, Math.min(100, state.progress))}%`;
    if (question) question.hidden = !state.finished;

    panel.querySelectorAll('.ea84-answer-row button').forEach(button => {
      const answer = button.dataset.answer;
      button.classList.toggle('is-correct', state.correct && answer === '6');
      button.classList.toggle('is-wrong', !state.correct && state.wrong === answer);
      button.disabled = state.correct;
    });

    if (message) {
      message.textContent = state.correct
        ? 'Правильно! Roy is six. Следующая сцена разблокирована.'
        : state.wrong
          ? 'Неверно. Попробуй ещё раз.'
          : '';
    }
  };

  const finishSong = stage => {
    stopAllAudio();
    state.playing = false;
    state.finished = true;
    state.progress = 100;
    state.part = SONG_PARTS.length - 1;
    state.status = 'Песня закончилась — ответь на вопрос';
    render(stage);
  };

  const createMusic = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    audioContext = new AudioContextClass();
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.11;
    musicGain.connect(audioContext.destination);
    return true;
  };

  const playTone = (frequency, start, duration, volume = 0.18) => {
    if (!audioContext || !musicGain) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(musicGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  };

  const playChordPattern = chordIndex => {
    if (!audioContext) return;
    const chord = CHORDS[chordIndex % CHORDS.length];
    const now = audioContext.currentTime + 0.015;

    /* Soft music-box arpeggio, intentionally quieter than Roy's voice. */
    playTone(chord[0] / 2, now, 0.55, 0.14);
    playTone(chord[0], now + 0.02, 0.32, 0.12);
    playTone(chord[1], now + 0.22, 0.32, 0.105);
    playTone(chord[2], now + 0.44, 0.40, 0.10);
  };

  const chooseRoyVoice = () => {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const english = voices.filter(voice => /^en[-_]/i.test(voice.lang || ''));
    if (!english.length) return null;

    const preferredNames = [
      /daniel/i,
      /arthur/i,
      /oliver/i,
      /alex/i,
      /ryan/i,
      /guy/i,
      /male/i,
      /english.*uk/i,
      /english.*us/i
    ];

    for (const pattern of preferredNames) {
      const match = english.find(voice => pattern.test(voice.name || ''));
      if (match) return match;
    }

    return english[0];
  };

  const waitForVoice = () => new Promise(resolve => {
    const immediate = chooseRoyVoice();
    if (immediate) {
      resolve(immediate);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis?.removeEventListener?.('voiceschanged', finish);
      resolve(chooseRoyVoice());
    };

    window.speechSynthesis?.addEventListener?.('voiceschanged', finish, { once: true });
    setTimeout(finish, 900);
  });

  const startFallbackRecording = stage => {
    stopSpeech();
    stopMusic();
    fallbackAudio = new Audio(FALLBACK_AUDIO_URL);
    fallbackAudio.preload = 'auto';
    fallbackAudio.volume = 0.96;

    state.status = 'Музыкальный голос недоступен — включена резервная запись';
    render(stage);

    fallbackAudio.ontimeupdate = () => {
      if (!fallbackAudio) return;
      const duration = Number.isFinite(fallbackAudio.duration) && fallbackAudio.duration > 0
        ? fallbackAudio.duration
        : 18;
      const ratio = Math.max(0, Math.min(1, fallbackAudio.currentTime / duration));
      state.progress = ratio * 100;
      state.part = Math.min(SONG_PARTS.length - 1, Math.floor(ratio * SONG_PARTS.length));
      render(stage);
    };
    fallbackAudio.onended = () => finishSong(stage);
    fallbackAudio.onerror = () => finishSong(stage);
    fallbackAudio.play().catch(() => finishSong(stage));
  };

  const singPart = (stage, voice, index, runId) => {
    if (runId !== generation || !state.playing) return;
    if (index >= SONG_PARTS.length) {
      nextPartTimer = setTimeout(() => finishSong(stage), 350);
      return;
    }

    const part = SONG_PARTS[index];
    state.part = index;
    state.progress = index / SONG_PARTS.length * 100;
    state.status = 'Рой поёт под музыку';
    render(stage);
    playChordPattern(part.chord);

    const utterance = new SpeechSynthesisUtterance(part.text);
    activeUtterance = utterance;
    utterance.lang = voice?.lang || 'en-GB';
    if (voice) utterance.voice = voice;
    utterance.pitch = part.pitch;
    utterance.rate = part.rate;
    utterance.volume = 1;

    utterance.onend = () => {
      if (runId !== generation || !state.playing) return;
      state.progress = (index + 1) / SONG_PARTS.length * 100;
      render(stage);
      nextPartTimer = setTimeout(() => singPart(stage, voice, index + 1, runId), part.gap);
    };

    utterance.onerror = () => {
      if (runId !== generation || !state.playing) return;
      startFallbackRecording(stage);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      startFallbackRecording(stage);
    }
  };

  const startSong = async stage => {
    if (state.playing) {
      stopAllAudio();
      state.playing = false;
      state.status = 'Песня остановлена';
      render(stage);
      return;
    }

    stopAllAudio();
    state = {
      playing: true,
      finished: false,
      correct: false,
      wrong: '',
      part: 0,
      progress: 0,
      status: 'Подготавливаем голос Роя и музыку…'
    };
    render(stage);

    const runId = generation;
    const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    if (!supportsSpeech) {
      startFallbackRecording(stage);
      return;
    }

    const voice = await waitForVoice();
    if (runId !== generation || !state.playing) return;

    try {
      if (createMusic() && audioContext?.state === 'suspended') await audioContext.resume();
    } catch (_) {
      stopMusic();
    }

    /* Never leave the scene locked if a browser loses a speech event. */
    hardFinishTimer = setTimeout(() => finishSong(stage), 36000);
    singPart(stage, voice, 0, runId);
  };

  const unlockNextSafely = () => {
    setTimeout(() => {
      const next = document.querySelector('.lesson-controls .next-button');
      if (!next) return;
      next.disabled = false;
      next.removeAttribute('disabled');
      next.setAttribute('aria-disabled', 'false');
      next.style.pointerEvents = 'auto';
      next.style.opacity = '1';
    }, 250);
  };

  const answer = (stage, value) => {
    const nativeButton = [...stage.querySelectorAll('.scene-content > .choice-row button')]
      .find(button => button.textContent.trim() === value);
    if (nativeButton) nativeButton.click();

    if (value === '6') {
      state.correct = true;
      state.wrong = '';
      unlockNextSafely();
    } else {
      state.wrong = value;
    }
    render(stage);
  };

  const build = stage => {
    const content = stage.querySelector('article.scene-card > .scene-content');
    if (!content) return;

    stage.classList.add('ea84-scene18-controlled');
    let panel = content.querySelector('.ea84-roy-panel');

    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'ea84-roy-panel';
      panel.innerHTML = `
        <div class="ea84-song-actions">
          <button type="button" class="ea84-song-play">▶ Послушать песню Роя</button>
          <button type="button" class="ea84-song-skip">Перейти к вопросу →</button>
        </div>
        <div class="ea84-song-status">Нажми, послушай песню и ответь на вопрос</div>
        <div class="ea84-song-line" aria-live="polite">${LYRIC_LINES[0]}</div>
        <div class="ea84-song-progress" aria-hidden="true"><i></i></div>
        <div class="ea84-question" hidden>
          <div class="ea84-question-copy">How old is Roy?<small>Сколько лет Рою?</small></div>
          <div class="ea84-answer-row">
            <button type="button" data-answer="4">4</button>
            <button type="button" data-answer="5">5</button>
            <button type="button" data-answer="6">6</button>
          </div>
          <div class="ea84-answer-message" aria-live="polite"></div>
        </div>
      `;

      panel.querySelector('.ea84-song-play').addEventListener('click', () => startSong(stage));
      panel.querySelector('.ea84-song-skip').addEventListener('click', () => finishSong(stage));
      panel.querySelector('.ea84-answer-row').addEventListener('click', event => {
        const button = event.target.closest('button[data-answer]');
        if (!button || state.correct) return;
        answer(stage, button.dataset.answer);
      });
      content.append(panel);
    }

    render(stage);
  };

  const sync = () => {
    const stage = getStage();
    if (!stage) {
      if (activeStage) stopAllAudio();
      activeStage = null;
      state = {
        playing: false,
        finished: false,
        correct: false,
        wrong: '',
        part: 0,
        progress: 0,
        status: 'Нажми, послушай песню и ответь на вопрос'
      };
      return;
    }

    activeStage = stage;
    build(stage);
  };

  new MutationObserver(() => requestAnimationFrame(sync)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', sync, { once: true })
    : sync();
})();
