(() => {
  if (window.__eaMobileV77Installed) return;
  window.__eaMobileV77Installed = true;

  const VERSION_TEXT = 'LESSON 1-1 · VERSION 92';

  const normalizeHeader = () => {
    const version = document.querySelector('.topbar .brand > span:last-child > small');
    if (version) {
      if (version.textContent !== VERSION_TEXT) version.textContent = VERSION_TEXT;
      version.classList.add('ea77-version-clean');
    }

    const topbar = document.querySelector('.topbar');
    if (topbar) topbar.classList.add('ea77-mobile-header');
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      normalizeHeader();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeHeader, { once: true });
  } else {
    normalizeHeader();
  }
})();