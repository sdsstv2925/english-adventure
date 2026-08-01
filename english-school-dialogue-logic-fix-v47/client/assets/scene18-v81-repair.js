(() => {
  if (window.__eaScene18V81RepairInstalled) return;
  window.__eaScene18V81RepairInstalled = true;

  const SONG_URL = '/audio/voice-boy-2/roy-song.mp3?v=81';
  const LYRICS = [
    [0.0, 2.7, '♪ What’s your name? What’s your name? ♪'],
    [2.7, 5.4, 'What’s your name, little boy?'],
    [5.4, 7.6, 'My name is Roy.'],
    [7.6, 11.1, '♪ How old are you? How old are you? ♪'],
    [11.1, 15.8, 'I am six, I am six, and you?']
  ];

  let fallbackAudio = null;
  let progressTimer = null;
  let repairTimer = null;

  const stopFallback = () => {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    if (fallbackAudio) {
      fallbackAudio.pause();
      fallbackAudio.src = '';
      fallbackAudio = null;
    }
  };

  const revealQuestion = stage => {
    const choices = stage.querySelector('.choice-row:not(.ea81-bootstrap-choice)');
    if (!choices) {
      stage.dataset.ea81SongFinished = 'true';
      return;
    }

    choices.removeAttribute('data-roy-locked');
    choices.classList.add('ea-roy-unlocked', 'ea76-roy-unlocked');

    if (!choices.querySelector('.ea-roy-question')) {
      const question = document.createElement('div');
      question.className = 'ea-roy-question';
      question.textContent = 'How old is Roy?';
      choices.prepend(question);
    }
  };

  const setLyric = (ui, time) => {
    const lyric = ui.querySelector('.ea76-lyric-line');
    if (!lyric) return;
    const active = LYRICS.find(([start, end]) => time >= start && time < end);
    lyric.textContent = active ? active[2] : '♪ Listen to Roy’s song! ♪';
  };

  const createFallbackUi = (stage, card) => {
    if (card.querySelector('.ea76-song-ui')) return;

    const nativeChildren = [...card.children];
    const ui = document.createElement('div');
    ui.className = 'ea76-song-ui ea81-song-fallback';
    ui.innerHTML = `
      <button type="button" class="ea76-song-play">▶ Послушать песню Роя</button>
      <div class="ea76-song-status">Песня с музыкой и строками</div>
      <div class="ea76-song-lyrics" aria-live="polite">
        <div class="ea76-lyric-line is-active">♪ Listen to Roy’s song! ♪</div>
      </div>
      <div class="ea76-song-progress" aria-hidden="true"><i></i></div>
    `;

    card.append(ui);
    nativeChildren.forEach(child => child.setAttribute('data-ea76-native-song', 'true'));
    stage.classList.add('ea76-scene18-controlled', 'ea81-scene18-repaired');

    const button = ui.querySelector('.ea76-song-play');
    const status = ui.querySelector('.ea76-song-status');
    const progress = ui.querySelector('.ea76-song-progress > i');

    button.addEventListener('click', () => {
      if (fallbackAudio && !fallbackAudio.paused) {
        stopFallback();
        button.textContent = '▶ Спеть сначала';
        status.textContent = 'Песня остановлена';
        return;
      }

      stopFallback();
      fallbackAudio = new Audio(SONG_URL);
      fallbackAudio.preload = 'auto';
      fallbackAudio.volume = 0.95;
      button.textContent = '■ Остановить песню';
      status.textContent = 'Рой поёт';
      ui.classList.add('is-playing');

      fallbackAudio.addEventListener('timeupdate', () => {
        if (!fallbackAudio) return;
        const duration = Number.isFinite(fallbackAudio.duration) && fallbackAudio.duration > 0
          ? fallbackAudio.duration
          : 17.5;
        progress.style.width = `${Math.min(100, fallbackAudio.currentTime / duration * 100)}%`;
        setLyric(ui, fallbackAudio.currentTime);
      });

      fallbackAudio.addEventListener('ended', () => {
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = null;
        fallbackAudio = null;
        ui.classList.remove('is-playing');
        ui.classList.add('is-finished');
        button.textContent = '↻ Спеть ещё раз';
        status.textContent = 'Песня закончилась — ответь на вопрос';
        progress.style.width = '100%';
        revealQuestion(stage);
      }, { once: true });

      fallbackAudio.addEventListener('error', () => {
        stopFallback();
        button.textContent = '▶ Попробовать снова';
        status.textContent = 'Не удалось загрузить песню';
      }, { once: true });

      fallbackAudio.play().catch(() => {
        stopFallback();
        button.textContent = '▶ Нажми ещё раз';
        status.textContent = 'Браузер заблокировал автозапуск';
      });
    });
  };

  const triggerOriginalBuilder = (stage) => {
    if (stage.querySelector('.ea76-song-ui')) return;

    let placeholder = stage.querySelector('.ea81-bootstrap-choice');
    if (!placeholder && !stage.querySelector('.choice-row')) {
      placeholder = document.createElement('div');
      placeholder.className = 'choice-row ea81-bootstrap-choice';
      placeholder.hidden = true;
      stage.append(placeholder);
    }

    const tick = document.createElement('span');
    tick.className = 'ea81-repair-tick';
    tick.hidden = true;
    stage.append(tick);
    queueMicrotask(() => tick.remove());
  };

  const sync = () => {
    const stage = document.querySelector('.stage.scene-roy');
    if (!stage) {
      stopFallback();
      return;
    }

    const card = stage.querySelector('.song-card');
    if (!card) return;

    const ui = card.querySelector('.ea76-song-ui');
    if (ui) {
      stage.classList.add('ea76-scene18-controlled');
      stage.querySelector('.ea81-bootstrap-choice')?.remove();
      if (stage.dataset.ea81SongFinished === 'true' || ui.classList.contains('is-finished')) {
        revealQuestion(stage);
      }
      return;
    }

    /* Do not leave an empty black card while the original observer rebuilds. */
    stage.classList.remove('ea76-scene18-controlled');
    card.querySelectorAll('[data-ea76-native-song="true"]').forEach(element => {
      element.removeAttribute('data-ea76-native-song');
    });

    triggerOriginalBuilder(stage);

    clearTimeout(repairTimer);
    repairTimer = setTimeout(() => {
      const currentStage = document.querySelector('.stage.scene-roy');
      const currentCard = currentStage?.querySelector('.song-card');
      if (!currentStage || !currentCard || currentCard.querySelector('.ea76-song-ui')) return;
      createFallbackUi(currentStage, currentCard);
      currentStage.querySelector('.ea81-bootstrap-choice')?.remove();
    }, 180);
  };

  new MutationObserver(() => requestAnimationFrame(sync)).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-roy-locked']
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', sync, { once: true })
    : sync();
})();
