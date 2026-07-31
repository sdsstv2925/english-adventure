(() => {
  if (window.__eaSceneFixesV66Installed) return;
  window.__eaSceneFixesV66Installed = true;

  const syncNameInput = () => {
    const input = document.querySelector('.stage.scene-names .name-line input');
    if (!input) return;

    input.style.setProperty('color', '#fff', 'important');
    input.style.setProperty('-webkit-text-fill-color', '#fff', 'important');
    input.style.setProperty('caret-color', '#fff', 'important');
    input.style.setProperty('opacity', '1', 'important');
  };

  const syncAgeAudio = () => {
    const stage = document.querySelector('.stage.scene-age');
    if (!stage) return;

    const card = stage.querySelector(':scope > article.scene-card');
    const sound = stage.querySelector('.speech-teacher .round-sound');
    if (!card || !sound) return;

    sound.style.setProperty('pointer-events', 'auto', 'important');
    sound.style.setProperty('z-index', '99990', 'important');
    sound.style.setProperty('cursor', 'pointer', 'important');

    let proxy = card.querySelector(':scope > .ea66-age-sound-proxy');
    if (!proxy) {
      proxy = document.createElement('button');
      proxy.type = 'button';
      proxy.className = 'ea66-age-sound-proxy';
      proxy.setAttribute('aria-label', 'Послушать вопрос учительницы');
      proxy.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        sound.click();
      });
      card.append(proxy);
    }

    const cardRect = card.getBoundingClientRect();
    const soundRect = sound.getBoundingClientRect();
    if (!cardRect.width || !soundRect.width) return;

    const size = Math.max(44, Math.ceil(Math.max(soundRect.width, soundRect.height) + 10));
    proxy.style.left = `${Math.round(soundRect.left - cardRect.left - (size - soundRect.width) / 2)}px`;
    proxy.style.top = `${Math.round(soundRect.top - cardRect.top - (size - soundRect.height) / 2)}px`;
    proxy.style.width = `${size}px`;
    proxy.style.height = `${size}px`;
  };

  const removeStaleProxy = () => {
    if (document.querySelector('.stage.scene-age')) return;
    document.querySelectorAll('.ea66-age-sound-proxy').forEach(element => element.remove());
  };

  const run = () => {
    syncNameInput();
    syncAgeAudio();
    removeStaleProxy();
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      run();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'value']
  });

  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('input', event => {
    if (event.target.matches?.('.stage.scene-names .name-line input')) syncNameInput();
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
