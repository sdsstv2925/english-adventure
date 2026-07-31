(() => {
  if (window.__eaScene9AudioV68Installed) return;
  window.__eaScene9AudioV68Installed = true;

  let activeAudio = null;
  let playToken = 0;

  const stopActive = () => {
    playToken += 1;
    if (activeAudio) {
      activeAudio.onended = null;
      activeAudio.onerror = null;
      activeAudio.pause();
      activeAudio.src = '';
      activeAudio = null;
    }
  };

  const setSpeaking = (text) => {
    window.dispatchEvent(new CustomEvent('lesson-character-speak', {
      detail: { who: text ? 'teacher' : null, text: text || '' }
    }));
  };

  const playFile = (src, token) => new Promise((resolve) => {
    if (token !== playToken) {
      resolve(false);
      return;
    }

    const audio = new Audio(src);
    activeAudio = audio;
    audio.preload = 'auto';
    audio.volume = 0.96;

    let finished = false;
    const finish = (played) => {
      if (finished) return;
      finished = true;
      audio.onended = null;
      audio.onerror = null;
      if (activeAudio === audio) activeAudio = null;
      resolve(played);
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => finish(false));
    }
  });

  const playTeacherQuestion = async () => {
    stopActive();
    const token = playToken;
    setSpeaking("What's your name and how old are you?");

    await playFile('/audio/voice/whats-your-name-boy.mp3?v=68', token);
    if (token !== playToken) return;

    await playFile('/audio/voice/how-old.mp3?v=68', token);
    if (token !== playToken) return;

    setSpeaking('');
  };

  const bind = () => {
    const button = document.querySelector('.stage.scene-age .speech-teacher .round-sound');
    if (!button || button.dataset.eaScene9AudioV68 === '1') return;

    button.dataset.eaScene9AudioV68 = '1';
    button.setAttribute('aria-label', 'Прослушать вопрос учительницы об имени и возрасте');

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      playTeacherQuestion();
    }, true);
  };

  const cleanup = () => {
    if (document.querySelector('.stage.scene-age')) return;
    stopActive();
    setSpeaking('');
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      bind();
      cleanup();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
