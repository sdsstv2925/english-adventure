(() => {
  if (window.__eaScene3V59Installed) return;
  window.__eaScene3V59Installed = true;

  const syncScene3 = () => {
    const stage = document.querySelector('.stage.scene-why-english');
    if (!stage) return;

    const content = stage.querySelector('.scene-content');
    if (!content) return;

    const speeches = [...content.querySelectorAll(':scope > .speech')];
    const choiceGrid = content.querySelector(':scope > .choice-grid');
    const successSpeech = content.querySelector(':scope > .choice-grid + .speech') || speeches.at(-1);

    if (!successSpeech || speeches.length < 2) {
      stage.classList.remove('ea-scene3-complete');
      return;
    }

    stage.classList.add('ea-scene3-complete');

    speeches.forEach(speech => {
      if (speech === successSpeech) {
        speech.style.removeProperty('display');
        speech.removeAttribute('aria-hidden');
      } else {
        speech.style.setProperty('display', 'none', 'important');
        speech.setAttribute('aria-hidden', 'true');
      }
    });

    if (choiceGrid) {
      choiceGrid.style.setProperty('display', 'none', 'important');
      choiceGrid.setAttribute('aria-hidden', 'true');
    }

    const feedback = stage.querySelector('.feedback');
    if (feedback) {
      feedback.style.setProperty('display', 'none', 'important');
      feedback.setAttribute('aria-hidden', 'true');
    }
  };

  const observer = new MutationObserver(syncScene3);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncScene3, { once: true });
  } else {
    syncScene3();
  }
})();
