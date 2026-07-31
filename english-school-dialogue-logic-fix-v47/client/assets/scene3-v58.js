(() => {
  if (window.__eaScene3V58Installed) return;
  window.__eaScene3V58Installed = true;

  const syncScene3 = () => {
    const stage = document.querySelector('.stage.scene-why-english');
    if (!stage) return;

    const content = stage.querySelector('.scene-content');
    if (!content) return;

    const speeches = [...content.querySelectorAll(':scope > .speech')];
    const successSpeech = content.querySelector(':scope > .choice-grid + .speech');

    if (!successSpeech) {
      stage.classList.remove('ea-scene3-complete');
      speeches.forEach(speech => speech.removeAttribute('aria-hidden'));
      return;
    }

    stage.classList.add('ea-scene3-complete');

    speeches.forEach(speech => {
      if (speech === successSpeech) {
        speech.removeAttribute('aria-hidden');
      } else {
        speech.setAttribute('aria-hidden', 'true');
      }
    });

    /* Match the visible text to the audio triggered by the correct answer. */
    const speechText = successSpeech.querySelector('.speech-text');
    if (speechText && speechText.textContent.trim() !== 'Yes! Excellent!') {
      speechText.textContent = 'Yes! Excellent!';
    }

    const translation = successSpeech.querySelector('.translation-line');
    if (translation) translation.remove();

    const speakerName = successSpeech.querySelector('.speaker-name');
    if (speakerName) speakerName.remove();

    const feedback = stage.querySelector('article.scene-card > .feedback');
    if (feedback) feedback.setAttribute('aria-hidden', 'true');
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
