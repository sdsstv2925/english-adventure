(() => {
  if (window.__eaScene3V57Installed) return;
  window.__eaScene3V57Installed = true;

  const updateScene = () => {
    const stage = document.querySelector('.stage.scene-why-english');
    if (!stage) return;

    const content = stage.querySelector('.scene-content');
    if (!content) return;

    const speeches = [...content.querySelectorAll(':scope > .speech')];
    const successSpeech = content.querySelector(':scope > .choice-grid + .speech');

    if (successSpeech && speeches.length > 1) {
      stage.classList.add('ea-scene3-complete');
      speeches.forEach(speech => {
        if (speech !== successSpeech) speech.setAttribute('aria-hidden', 'true');
      });
    } else {
      stage.classList.remove('ea-scene3-complete');
      speeches.forEach(speech => speech.removeAttribute('aria-hidden'));
    }
  };

  const observer = new MutationObserver(updateScene);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateScene, { once: true });
  } else {
    updateScene();
  }
})();
