(() => {
  if (window.__eaSceneStateV62Installed) return;
  window.__eaSceneStateV62Installed = true;

  const directChildren = (parent, selector) =>
    [...parent.children].filter(el => el.matches(selector));

  const syncWhyEnglish = stage => {
    const card = stage.querySelector(':scope > article.scene-card');
    const content = card?.querySelector(':scope > .scene-content');
    if (!card || !content) return;

    const speeches = directChildren(content, '.speech');
    const completed = speeches.length > 1;

    card.classList.toggle('ea62-complete', completed);
    content.classList.toggle('ea62-complete', completed);

    speeches.forEach((speech, index) => {
      const active = completed && index === speeches.length - 1;
      speech.classList.toggle('ea62-active-speech', active);
      if (active || !completed) speech.removeAttribute('aria-hidden');
      else speech.setAttribute('aria-hidden', 'true');
    });
  };

  const syncLanguages = stage => {
    const card = stage.querySelector(':scope > article.scene-card');
    const content = card?.querySelector(':scope > .scene-content');
    if (!card || !content) return;

    const completed = Boolean(content.querySelector(':scope > .story-card'));
    card.classList.toggle('ea62-complete', completed);
    content.classList.toggle('ea62-complete', completed);
  };

  const syncNames = stage => {
    const card = stage.querySelector(':scope > article.scene-card');
    if (!card) return;

    const completed = Boolean(card.querySelector(':scope > .feedback.success'));
    card.classList.toggle('ea62-complete', completed);
  };

  const run = () => {
    const whyEnglish = document.querySelector('.stage.scene-why-english');
    if (whyEnglish) syncWhyEnglish(whyEnglish);

    const languages = document.querySelector('.stage.scene-languages');
    if (languages) syncLanguages(languages);

    const names = document.querySelector('.stage.scene-names');
    if (names) syncNames(names);
  };

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class']
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
