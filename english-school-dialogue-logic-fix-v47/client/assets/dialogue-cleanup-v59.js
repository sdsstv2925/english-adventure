(() => {
  if (window.__eaDialogueCleanupV59Installed) return;
  window.__eaDialogueCleanupV59Installed = true;

  const cleanStage = stage => {
    const content = stage.querySelector('.scene-content');
    if (!content) return;

    const speeches = [...content.querySelectorAll(':scope > .speech')]
      .filter(el => getComputedStyle(el).display !== 'none');

    if (speeches.length <= 1) return;

    const active = speeches[speeches.length - 1];
    speeches.forEach(speech => {
      if (speech === active) {
        speech.style.removeProperty('display');
        speech.removeAttribute('aria-hidden');
      } else {
        speech.style.setProperty('display', 'none', 'important');
        speech.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const run = () => {
    document.querySelectorAll('.stage[class*="scene-"]').forEach(cleanStage);
  };

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
