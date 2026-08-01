(() => {
  if (window.__eaScene14AudioV86Installed) return;
  window.__eaScene14AudioV86Installed = true;

  const AUDIO_URL = '/audio/voice-boy-2/i-give-up.mp3?v=86';
  const DIALOGUE_TEXT = "One, two, three, five, six! I give up! I don't know!";
  let audio = null;
  let activeButton = null;

  const stop = () => {
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.src = '';
      audio = null;
    }

    if (activeButton) {
      activeButton.classList.remove('ea86-is-playing');
      activeButton.setAttribute('aria-pressed', 'false');
      activeButton = null;
    }

    window.dispatchEvent(new CustomEvent('lesson-character-speak', {
      detail: { who: null, text: '' }
    }));
  };

  const play = button => {
    if (activeButton === button && audio && !audio.paused) {
      stop();
      return;
    }

    stop();
    activeButton = button;
    button.classList.add('ea86-is-playing');
    button.setAttribute('aria-pressed', 'true');

    window.dispatchEvent(new CustomEvent('lesson-character-speak', {
      detail: { who: 'dunno', text: DIALOGUE_TEXT }
    }));

    audio = new Audio(AUDIO_URL);
    audio.preload = 'auto';
    audio.volume = 0.96;

    const finish = () => stop();
    audio.onended = finish;
    audio.onerror = finish;

    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(finish);
    }
  };

  const getButton = target => {
    const button = target.closest?.('.stage.scene-dunno-test .speech-dunno .round-sound');
    if (!button) return null;

    const speech = button.closest('.speech-dunno');
    const text = speech?.textContent?.replace(/\s+/g, ' ').trim() || '';
    if (!/I give up|I don[’']t know|1,\s*2,\s*3,\s*5,\s*6/i.test(text)) return null;

    return button;
  };

  document.addEventListener('click', event => {
    const button = getButton(event.target);
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    play(button);
  }, true);

  const normalize = () => {
    const button = document.querySelector('.stage.scene-dunno-test .speech-dunno .round-sound');
    if (!button) {
      if (activeButton) stop();
      return;
    }

    button.type = 'button';
    button.setAttribute('aria-label', 'Послушать ответ Незнайки');
    button.setAttribute('aria-pressed', button === activeButton ? 'true' : 'false');
    button.style.pointerEvents = 'auto';
  };

  new MutationObserver(() => requestAnimationFrame(normalize)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', normalize, { once: true })
    : normalize();
})();
