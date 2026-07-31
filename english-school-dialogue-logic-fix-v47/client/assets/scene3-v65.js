(() => {
  if (window.__eaScene3V65Installed) return;
  window.__eaScene3V65Installed = true;

  let replayAudio = null;

  const playTeacherReply = () => {
    if (replayAudio) {
      replayAudio.pause();
      replayAudio.src = '';
    }

    replayAudio = new Audio('/audio/voice/yes-excellent.mp3?v=65');
    replayAudio.volume = 0.96;
    replayAudio.play().catch(() => {});
  };

  const directChildren = (parent, selector) =>
    [...parent.children].filter(element => element.matches(selector));

  const hideNativeCompletedState = (card, content) => {
    [...content.children].forEach(element => {
      element.style.setProperty('display', 'none', 'important');
      element.setAttribute('aria-hidden', 'true');
    });

    const feedback = card.querySelector(':scope > .feedback');
    if (feedback) {
      feedback.style.setProperty('display', 'none', 'important');
      feedback.setAttribute('aria-hidden', 'true');
    }
  };

  const renderResult = card => {
    let layer = card.querySelector(':scope > .ea65-scene3-result');
    if (layer) return;

    layer = document.createElement('div');
    layer.className = 'ea65-scene3-result';
    layer.innerHTML = `
      <div class="ea65-scene3-child">
        <span class="ea65-scene3-role">Ответ ученика</span>
        <strong>Изучать английский 🇬🇧</strong>
      </div>

      <div class="ea65-scene3-teacher">
        <div>
          <span class="ea65-scene3-role">Мисс Эмми</span>
          <strong>Yes! Excellent!</strong>
          <small>Да! Отлично!</small>
        </div>
        <button type="button" class="ea65-scene3-sound" aria-label="Послушать ответ учительницы">🔊</button>
      </div>
    `;

    layer.querySelector('.ea65-scene3-sound')?.addEventListener('click', playTeacherReply);
    card.append(layer);
  };

  const clearResult = card => {
    card.querySelector(':scope > .ea65-scene3-result')?.remove();
  };

  function syncScene3() {
    const stage = document.querySelector('.stage.scene-why-english');
    if (!stage) return;

    const card = stage.querySelector(':scope > article.scene-card');
    const content = card?.querySelector(':scope > .scene-content');
    if (!card || !content) return;

    const speeches = directChildren(content, '.speech');
    const completed = speeches.length > 1 || Boolean(card.querySelector(':scope > .feedback.success'));

    if (!completed) {
      clearResult(card);
      return;
    }

    stage.classList.add('ea65-scene3-complete');
    hideNativeCompletedState(card, content);
    renderResult(card);
  }

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(syncScene3);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncScene3, { once: true });
  } else {
    syncScene3();
  }
})();
