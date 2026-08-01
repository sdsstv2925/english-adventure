(() => {
  if (window.__eaScene18V84Installed) return;
  window.__eaScene18V84Installed = true;

  const AUDIO_URL = '/audio/voice-boy-2/roy-song.mp3?v=84';
  const DEFAULT_DURATION = 18;
  const LYRICS = [
    [0.0, 2.6, 'What’s your name? What’s your name?'],
    [2.6, 5.4, 'What’s your name, little boy?'],
    [5.4, 7.5, 'My name is Roy.'],
    [7.5, 11.0, 'How old are you? How old are you?'],
    [11.0, 14.0, 'How old are you?'],
    [14.0, 18.0, 'I am six, I am six, and you?']
  ];

  let activeAudio = null;
  let hardFinishTimer = null;
  let state = {
    started: false,
    finished: false,
    correct: false,
    wrong: '',
    currentTime: 0,
    duration: DEFAULT_DURATION
  };

  const clearHardTimer = () => {
    if (hardFinishTimer) {
      clearTimeout(hardFinishTimer);
      hardFinishTimer = null;
    }
  };

  const stopAudio = () => {
    if (!activeAudio) return;
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio.ontimeupdate = null;
    activeAudio.onloadedmetadata = null;
    activeAudio.pause();
    activeAudio.src = '';
    activeAudio = null;
  };

  const getStage = () => document.querySelector('.stage.scene-roy');
  const getPanel = stage => stage?.querySelector('.ea84-roy-panel');

  const currentLyric = time => {
    const item = LYRICS.find(([start, end]) => time >= start && time < end);
    return item ? item[2] : LYRICS[LYRICS.length - 1][2];
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

    const duration = state.duration > 0 ? state.duration : DEFAULT_DURATION;
    const progress = state.finished ? 100 : Math.min(100, state.currentTime / duration * 100);

    if (playButton) {
      playButton.textContent = state.started && !state.finished
        ? '■ Остановить песню'
        : state.finished
          ? '↻ Послушать ещё раз'
          : '▶ Послушать песню Роя';
    }

    if (skipButton) skipButton.hidden = !state.started || state.finished;

    if (status) {
      status.textContent = state.started && !state.finished
        ? 'Воспроизводится чистая голосовая дорожка'
        : state.finished
          ? 'Песня закончилась — ответь на вопрос'
          : 'Нажми, послушай и ответь на вопрос';
    }

    if (line) line.textContent = currentLyric(state.currentTime);
    if (bar) bar.style.width = `${progress}%`;
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

  const finish = stage => {
    clearHardTimer();
    stopAudio();
    state.started = false;
    state.finished = true;
    state.currentTime = state.duration || DEFAULT_DURATION;
    render(stage);
  };

  const armHardFinish = stage => {
    clearHardTimer();
    const milliseconds = Math.max(18500, (state.duration + 0.8) * 1000);
    hardFinishTimer = setTimeout(() => finish(stage), milliseconds);
  };

  const start = stage => {
    if (activeAudio && !activeAudio.paused) {
      clearHardTimer();
      stopAudio();
      state.started = false;
      render(stage);
      return;
    }

    clearHardTimer();
    stopAudio();
    state.started = true;
    state.finished = false;
    state.correct = false;
    state.wrong = '';
    state.currentTime = 0;
    state.duration = DEFAULT_DURATION;
    render(stage);

    activeAudio = new Audio(AUDIO_URL);
    activeAudio.preload = 'auto';
    activeAudio.volume = 0.96;

    activeAudio.onloadedmetadata = () => {
      if (!activeAudio) return;
      if (Number.isFinite(activeAudio.duration) && activeAudio.duration > 0) {
        state.duration = activeAudio.duration;
      }
      armHardFinish(stage);
      render(stage);
    };

    activeAudio.ontimeupdate = () => {
      if (!activeAudio) return;
      state.currentTime = activeAudio.currentTime;
      render(stage);
      if (state.currentTime >= Math.max(0, state.duration - 0.15)) finish(stage);
    };

    activeAudio.onended = () => finish(stage);
    activeAudio.onerror = () => {
      state.duration = DEFAULT_DURATION;
      finish(stage);
      const status = getPanel(stage)?.querySelector('.ea84-song-status');
      if (status) status.textContent = 'Звук не загрузился — можно сразу ответить на вопрос';
    };

    armHardFinish(stage);
    activeAudio.play().catch(() => {
      state.started = false;
      clearHardTimer();
      stopAudio();
      render(stage);
      const status = getPanel(stage)?.querySelector('.ea84-song-status');
      if (status) status.textContent = 'Браузер заблокировал звук. Нажми ещё раз или перейди к вопросу.';
      const skip = getPanel(stage)?.querySelector('.ea84-song-skip');
      if (skip) skip.hidden = false;
    });
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
        <div class="ea84-song-status">Нажми, послушай и ответь на вопрос</div>
        <div class="ea84-song-line" aria-live="polite">What’s your name? What’s your name?</div>
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

      panel.querySelector('.ea84-song-play').addEventListener('click', () => start(stage));
      panel.querySelector('.ea84-song-skip').addEventListener('click', () => finish(stage));
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
      clearHardTimer();
      stopAudio();
      state = {
        started: false,
        finished: false,
        correct: false,
        wrong: '',
        currentTime: 0,
        duration: DEFAULT_DURATION
      };
      return;
    }
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
