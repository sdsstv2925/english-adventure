(() => {
  if (window.__eaScene18V76UnlockGuardInstalled) return;
  window.__eaScene18V76UnlockGuardInstalled = true;

  const sync = () => {
    const stage = document.querySelector('.stage.scene-roy');
    if (!stage) return;

    const ui = stage.querySelector('.ea76-song-ui');
    const choices = stage.querySelector('.choice-row');
    if (!ui || !choices || !ui.classList.contains('is-finished')) return;

    choices.removeAttribute('data-roy-locked');
    choices.classList.add('ea-roy-unlocked', 'ea76-roy-unlocked');

    if (!choices.querySelector('.ea-roy-question')) {
      const question = document.createElement('div');
      question.className = 'ea-roy-question';
      question.textContent = 'How old is Roy?';
      choices.prepend(question);
    }
  };

  new MutationObserver(sync).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-roy-locked']
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', sync, { once: true })
    : sync();
})();
