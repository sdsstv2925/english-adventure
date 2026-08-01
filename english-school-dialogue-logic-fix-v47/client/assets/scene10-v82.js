(() => {
  if (window.__eaScene10V82Installed) return;
  window.__eaScene10V82Installed = true;

  const STALE_TEXT = 'хорошо! слушай следующую команду';
  const COMMAND_RE = /sit on the (floor|chairs)!/i;
  const TASK_RE = /выполни команду и нажми/i;

  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();

  const ownText = element => normalize(
    [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join(' ')
  );

  const hasVisibleBox = element => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const background = style.backgroundColor || '';
    const hasBackground = background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent';
    return rect.width > 120 && rect.height > 20 && (
      hasBackground ||
      style.position === 'absolute' ||
      style.position === 'fixed' ||
      style.borderRadius !== '0px'
    );
  };

  const findFeedbackBox = (stage, textElement) => {
    const preferred = textElement.closest('.feedback, [class*="feedback"], [role="status"], [aria-live]');
    if (preferred && stage.contains(preferred)) return preferred;

    let element = textElement;
    let fallback = textElement;

    while (element && element !== stage) {
      const text = normalize(element.textContent).toLowerCase();
      if (!text.includes(STALE_TEXT)) break;
      if (COMMAND_RE.test(text)) break;
      fallback = element;
      if (hasVisibleBox(element)) return element;
      element = element.parentElement;
    }

    return fallback;
  };

  const sync = () => {
    const stages = [...document.querySelectorAll('.stage')];

    stages.forEach(stage => {
      const stageText = normalize(stage.textContent);
      if (!TASK_RE.test(stageText) || !COMMAND_RE.test(stageText)) return;

      const staleTextElements = [...stage.querySelectorAll('*')].filter(element =>
        ownText(element).toLowerCase().includes(STALE_TEXT)
      );

      staleTextElements.forEach(textElement => {
        const box = findFeedbackBox(stage, textElement);
        if (!box) return;
        box.classList.add('ea82-scene10-stale-feedback');
        box.setAttribute('aria-hidden', 'true');
      });
    });
  };

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(sync);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync, { once: true });
  } else {
    sync();
  }
})();
