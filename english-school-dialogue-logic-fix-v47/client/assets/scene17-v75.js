(() => {
  if (window.__eaScene17V75Installed) return;
  window.__eaScene17V75Installed = true;

  function syncScene17() {
    const stage = document.querySelector('.stage.scene-secret-bag');
    if (!stage) return;

    const content = stage.querySelector(':scope > article.scene-card > .scene-content');
    if (!content) return;

    const pictureCard = content.querySelector(':scope > .picture-card');
    const completionButton = content.querySelector(':scope > .primary-action');
    const choiceRow = content.querySelector(':scope > .choice-row');

    const revealed = Boolean(pictureCard);
    stage.classList.toggle('ea75-revealed', revealed);
    stage.classList.toggle('ea75-guessing', !revealed);

    if (choiceRow) {
      choiceRow.setAttribute('aria-label', 'Выбери, что находится в сумке');
      choiceRow.querySelectorAll(':scope > button').forEach(button => {
        const answer = button.textContent?.trim().toLowerCase();
        if (answer) button.setAttribute('aria-label', `Ответ: ${answer}`);
      });
    }

    if (completionButton) {
      completionButton.textContent = 'Я запомнил — дальше →';
      completionButton.setAttribute('aria-label', 'Завершить задание и открыть следующую сцену');
    }
  }

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(syncScene17);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncScene17, { once: true });
  } else {
    syncScene17();
  }
})();
