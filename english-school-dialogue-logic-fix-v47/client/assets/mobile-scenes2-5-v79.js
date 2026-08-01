(() => {
  if (window.__eaMobileScenes25V79Installed) return;
  window.__eaMobileScenes25V79Installed = true;

  const MOBILE_QUERY = '(max-width: 880px)';
  const ACTION_SELECTOR = [
    '.primary-action',
    '.secondary-action',
    '.practice-action',
    '.repeat-action',
    '.result-card',
    '.practice-result',
    '.repeat-result'
  ].join(',');

  const hasMeaningfulMedia = element => Boolean(
    element.querySelector('img, svg, canvas, video, audio, input, textarea, select')
  );

  const hasMeaningfulButton = element => {
    const buttons = element.matches('button') ? [element] : [...element.querySelectorAll('button')];
    return buttons.some(button => button.textContent.trim() || button.getAttribute('aria-label'));
  };

  const normalizeScene5 = () => {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;

    const content = document.querySelector('.stage.scene-tongue article.scene-card > .scene-content');
    if (!content) return;

    [...content.children].forEach(element => {
      const text = element.textContent.replace(/\s+/g, ' ').trim();
      const isActionLike = element.matches(ACTION_SELECTOR);
      const isBlank = !text && !hasMeaningfulMedia(element) && !hasMeaningfulButton(element);

      element.classList.toggle('ea79-mobile-empty', isBlank);

      if (isActionLike && !isBlank) {
        element.classList.add('ea79-mobile-filled-action');
      } else {
        element.classList.remove('ea79-mobile-filled-action');
      }
    });
  };

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(normalizeScene5);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener('resize', normalizeScene5, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeScene5, { once: true });
  } else {
    normalizeScene5();
  }
})();
