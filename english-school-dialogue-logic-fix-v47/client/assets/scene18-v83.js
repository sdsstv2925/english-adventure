(() => {
  if (window.__eaScene18V83Installed) return;
  window.__eaScene18V83Installed = true;

  const RAW_SONG_URL = '/audio/voice-boy-2/roy-song.mp3?v=83';
  const SONG_DURATION = 17.5;
  const LYRICS = [
    [0.0, 1.3, '♪ Listen to Roy’s song! ♪'],
    [1.3, 3.5, 'What’s your name? What’s your name?'],
    [3.5, 6.0, 'What’s your name, little boy?'],
    [6.0, 7.7, 'My name is Roy.'],
    [7.7, 10.2, 'How old are you? How old are you?'],
    [10.2, 12.5, 'How old are you?'],
    [12.5, 17.5, 'I am six, I am six, and you?']
  ];

  let activeStage = null;
  let playbackMode = null;
  let fallbackAudio = null;
  let monitorTimer = null;
  let lyricTimer = null;
  let startedAt = 0;
  let songFinished = false;
  let answeredCorrectly = false;
  let lastWrongAnswer = '';

  const clearTimers = () => {
    if (monitorTimer) {
      clearInterval(monitorTimer);
      monitorTimer = null;
    }
    if (lyricTimer) {
      clearInterval(lyricTimer);
      lyricTimer = null;
    }
  };

  const stopFallback = () => {
    if (!fallbackAudio) return;
    fallbackAudio.onended = null;
    fallbackAudio.onerror = null;
    fallbackAudio.pause();
    fallbackAudio.src = '';
    fallbackAudio = null;
  };

  const getPanel = stage => stage?.querySelector('.ea83-roy-panel');

  const setStatus = (stage, text) => {
    const status = getPanel(stage)?.querySelector('.ea83-song-status');
    if (status) status.textContent = text;
  };

  const setButton = (stage, text, disabled = false) => {
    const button = getPanel(stage)?.querySelector('.ea83-song-button');
    if (!button) return;
    button.textContent = text;
    button.disabled = disabled;
  };

  const setProgress = (stage, value) => {
    const progress = getPanel(stage)?.querySelector('.ea83-song-progress > i');
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
  };

  const setLyric = (stage, elapsed) => {
    const line = getPanel(stage)?.querySelector('.ea83-song-line');
    if (!line) return;
    const active = LYRICS.find(([start, end]) => elapsed >= start && elapsed < end);
    line.textContent = active ? active[2] : '♪ Listen to Roy’s song! ♪';
  };

  const renderQuestion = stage => {
    const panel = getPanel(stage);
    if (!panel) return;

    const question = panel.querySelector('.ea83-roy-question');
    if (!question) return;

    question.hidden = !songFinished;
    const message = question.querySelector('.ea83-answer-message');
    const buttons = [...question.querySelectorAll('.ea83-answer-row button')];

    buttons.forEach(button => {
      const value = button.dataset.answer;
      button.classList.toggle('is-correct', answeredCorrectly && value === '6');
      button.classList.toggle('is-wrong', !answeredCorrectly && lastWrongAnswer === value);
      button.disabled = answeredCorrectly;
    });

    if (message) {
      message.textContent = answeredCorrectly
        ? 'Правильно! Roy is six. Можно идти дальше.'
        : lastWrongAnswer
          ? 'Попробуй ещё раз.'
          : '';
    }
  };

  const finishSong = stage => {
    if (!stage) return;
    clearTimers();
    stopFallback();
    playbackMode = null;
    songFinished = true;
    setProgress(stage, 100);
    setLyric(stage, SONG_DURATION - 0.01);
    setStatus(stage, 'Песня закончилась — ответь на вопрос');
    setButton(stage, '↻ Спеть ещё раз');
    renderQuestion(stage);
  };

  const startVisibleTimeline = stage => {
    startedAt = performance.now();
    setButton(stage, '■ Остановить песню');
    setStatus(stage, 'Рой поёт с музыкой');
    setProgress(stage, 0);
    setLyric(stage, 0);

    if (lyricTimer) clearInterval(lyricTimer);
    lyricTimer = setInterval(() => {
      const elapsed = Math.min(SONG_DURATION, (performance.now() - startedAt) / 1000);
      setLyric(stage, elapsed);
      setProgress(stage, elapsed / SONG_DURATION * 100);
    }, 100);
  };

  const startFallback = stage => {
    clearTimers();
    stopFallback();
    playbackMode = 'fallback';
    fallbackAudio = new Audio(RAW_SONG_URL);
    fallbackAudio.preload = 'auto';
    fallbackAudio.volume = 0.96;

    fallbackAudio.onplay = () => startVisibleTimeline(stage);
    fallbackAudio.ontimeupdate = () => {
      if (!fallbackAudio) return;
      const duration = Number.isFinite(fallbackAudio.duration) && fallbackAudio.duration > 0
        ? fallbackAudio.duration
        : SONG_DURATION;
      setLyric(stage, fallbackAudio.currentTime);
      setProgress(stage, fallbackAudio.currentTime / duration * 100);
    };
    fallbackAudio.onended = () => finishSong(stage);
    fallbackAudio.onerror = () => {
      clearTimers();
      stopFallback();
      playbackMode = null;
      setButton(stage, '▶ Попробовать ещё раз');
      setStatus(stage, 'Не удалось загрузить песню');
    };

    fallbackAudio.play().catch(() => {
      clearTimers();
      stopFallback();
      playbackMode = null;
      setButton(stage, '▶ Нажми ещё раз');
      setStatus(stage, 'Браузер заблокировал запуск звука');
    });
  };

  const startExistingMusicEngine = stage => {
    const legacyUi = stage.querySelector('.song-card .ea76-song-ui');
    const legacyButton = legacyUi?.querySelector('.ea76-song-play');
    if (!legacyUi || !legacyButton) {
      startFallback(stage);
      return;
    }

    playbackMode = 'engine';
    setButton(stage, 'Создаём музыкальную версию…', true);
    setStatus(stage, 'Подготавливаем мелодию и детский голос');
    setProgress(stage, 0);
    setLyric(stage, 0);

    legacyButton.click();
    const waitStartedAt = performance.now();

    monitorTimer = setInterval(() => {
      const currentUi = stage.querySelector('.song-card .ea76-song-ui');
      if (!currentUi) {
        clearTimers();
        startFallback(stage);
        return;
      }

      if (currentUi.classList.contains('is-playing')) {
        if (!startedAt) startVisibleTimeline(stage);
        return;
      }

      if (currentUi.classList.contains('is-finished')) {
        finishSong(stage);
        return;
      }

      const legacyStatus = currentUi.querySelector('.ea76-song-status')?.textContent || '';
      if (/не удалось|ошиб|blocked|заблок/i.test(legacyStatus)) {
        clearTimers();
        startFallback(stage);
        return;
      }

      if (performance.now() - waitStartedAt > 15000) {
        clearTimers();
        startFallback(stage);
      }
    }, 120);
  };

  const stopPlayback = stage => {
    if (playbackMode === 'engine') {
      const legacyUi = stage.querySelector('.song-card .ea76-song-ui');
      if (legacyUi?.classList.contains('is-playing')) {
        legacyUi.querySelector('.ea76-song-play')?.click();
      }
    }

    clearTimers();
    stopFallback();
    playbackMode = null;
    startedAt = 0;
    setButton(stage, '▶ Спеть сначала');
    setStatus(stage, 'Песня остановлена');
  };

  const play = stage => {
    if (playbackMode) {
      stopPlayback(stage);
      return;
    }

    songFinished = false;
    answeredCorrectly = false;
    lastWrongAnswer = '';
    startedAt = 0;
    renderQuestion(stage);
    startExistingMusicEngine(stage);
  };

  const proxyAnswer = (stage, answer) => {
    const nativeButton = [...stage.querySelectorAll('.scene-content > .choice-row button')]
      .find(button => button.textContent.trim() === answer);

    if (nativeButton) nativeButton.click();

    if (answer === '6') {
      answeredCorrectly = true;
      lastWrongAnswer = '';

      /* Native React click normally unlocks this. Keep a safe fallback. */
      setTimeout(() => {
        const next = document.querySelector('.lesson-controls .next-button');
        if (next && next.disabled) {
          next.disabled = false;
          next.setAttribute('aria-disabled', 'false');
        }
      }, 250);
    } else {
      lastWrongAnswer = answer;
    }

    renderQuestion(stage);
  };

  const buildPanel = stage => {
    const content = stage.querySelector('article.scene-card > .scene-content');
    if (!content) return;

    stage.classList.add('ea83-scene18-controlled');

    let panel = content.querySelector('.ea83-roy-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'ea83-roy-panel';
      panel.innerHTML = `
        <button type="button" class="ea83-song-button">▶ Послушать песню Роя</button>
        <div class="ea83-song-status">Песня с музыкой и строками</div>
        <div class="ea83-song-line" aria-live="polite">♪ Listen to Roy’s song! ♪</div>
        <div class="ea83-song-progress" aria-hidden="true"><i></i></div>
        <div class="ea83-roy-question" hidden>
          <div class="ea83-question-copy">
            How old is Roy?
            <small>Сколько лет Рою?</small>
          </div>
          <div class="ea83-answer-row">
            <button type="button" data-answer="4">4</button>
            <button type="button" data-answer="5">5</button>
            <button type="button" data-answer="6">6</button>
          </div>
          <div class="ea83-answer-message" aria-live="polite"></div>
        </div>
      `;

      panel.querySelector('.ea83-song-button').addEventListener('click', () => play(stage));
      panel.querySelector('.ea83-answer-row').addEventListener('click', event => {
        const button = event.target.closest('button[data-answer]');
        if (!button || answeredCorrectly) return;
        proxyAnswer(stage, button.dataset.answer);
      });

      content.append(panel);
    }

    renderQuestion(stage);
  };

  const sync = () => {
    const stage = document.querySelector('.stage.scene-roy');
    if (!stage) {
      if (activeStage) {
        clearTimers();
        stopFallback();
        playbackMode = null;
        startedAt = 0;
      }
      activeStage = null;
      return;
    }

    activeStage = stage;
    buildPanel(stage);
  };

  new MutationObserver(() => requestAnimationFrame(sync)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', sync, { once: true })
    : sync();
})();
