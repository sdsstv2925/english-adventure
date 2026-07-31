(() => {
  if (window.__eaScene2V70Installed) return;
  window.__eaScene2V70Installed = true;

  const COMPLETE_KEY = 'english-adventure-scene2-user-complete-v70';
  let replayAudio = null;
  let resultAudioPlayed = false;
  let transitionScheduled = false;
  let transitionTimer = null;

  const clearTransition = () => {
    if (transitionTimer) {
      window.clearTimeout(transitionTimer);
      transitionTimer = null;
    }
    transitionScheduled = false;
  };

  const goToNextScene = () => {
    const stage = document.querySelector('.stage.scene-come-in');
    if (!stage) return;

    const next = document.querySelector('.lesson-controls .next-button');
    if (!next || next.disabled) return;

    next.click();
  };

  const scheduleNextScene = delay = 250 => {
    if (transitionScheduled) return;
    transitionScheduled = true;

    transitionTimer = window.setTimeout(() => {
      transitionTimer = null;
      goToNextScene();
    }, delay);
  };

  const playFile = (src, onFinished) => {
    if (replayAudio) {
      replayAudio.onended = null;
      replayAudio.onerror = null;
      replayAudio.pause();
      replayAudio.src = '';
    }

    replayAudio = new Audio(src);
    replayAudio.volume = 0.96;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onFinished?.();
    };

    replayAudio.onended = finish;
    replayAudio.onerror = finish;

    const promise = replayAudio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(finish);
    }
  };

  const setNextEnabled = enabled => {
    const next = document.querySelector('.lesson-controls .next-button');
    if (!next) return;

    const mustDisable = !enabled;
    if (next.disabled !== mustDisable) next.disabled = mustDisable;

    const ariaValue = enabled ? 'false' : 'true';
    if (next.getAttribute('aria-disabled') !== ariaValue) {
      next.setAttribute('aria-disabled', ariaValue);
    }

    next.classList.toggle('ea64-scene2-locked', mustDisable);
  };

  const hideNativeScene2 = card => {
    const content = card.querySelector(':scope > .scene-content');
    if (!content) return;

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

  const createLayer = card => {
    let layer = card.querySelector(':scope > .ea64-scene2-layer');
    if (layer) return layer;

    layer = document.createElement('div');
    layer.className = 'ea64-scene2-layer';
    card.append(layer);
    return layer;
  };

  const renderWaiting = layer => {
    clearTransition();
    resultAudioPlayed = false;

    if (layer.dataset.state === 'waiting') return;
    layer.dataset.state = 'waiting';

    layer.innerHTML = `
      <div class="ea64-scene2-caption">
        <div class="ea64-scene2-copy">
          <strong>Come in, boys and girls!</strong>
          <span>Sit down on the carpet!</span>
          <small>Входите, мальчики и девочки! Садитесь на ковёр.</small>
        </div>
        <button type="button" class="ea64-scene2-sound" aria-label="Послушать приглашение учительницы">🔊</button>
      </div>

      <div class="ea64-scene2-task">
        <span>Послушай учительницу и помоги детям сесть на ковёр.</span>
        <button type="button" class="ea64-scene2-seat">Сесть на ковёр</button>
      </div>
    `;

    layer.querySelector('.ea64-scene2-sound')?.addEventListener('click', () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Come in, boys and girls! Sit down on the carpet!');
        utterance.lang = 'en-GB';
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
      }
    });

    layer.querySelector('.ea64-scene2-seat')?.addEventListener('click', event => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Дети садятся на ковёр…';

      sessionStorage.setItem(COMPLETE_KEY, '1');
      window.setTimeout(syncScene2, 180);
    });
  };

  const renderComplete = layer => {
    if (layer.dataset.state !== 'complete') {
      layer.dataset.state = 'complete';
      layer.innerHTML = `
        <div class="ea64-scene2-result">
          <div>
            <strong>Good morning!</strong>
            <small>Доброе утро!</small>
          </div>
          <button type="button" class="ea64-scene2-sound" aria-label="Послушать Good morning">🔊</button>
        </div>
      `;

      layer.querySelector('.ea64-scene2-sound')?.addEventListener('click', () => {
        clearTransition();
        playFile('/audio/voice-girl/good-morning.mp3?v=70');
      });
    }

    if (!resultAudioPlayed) {
      resultAudioPlayed = true;
      window.setTimeout(() => {
        playFile('/audio/voice-girl/good-morning.mp3?v=70', () => scheduleNextScene(300));
        transitionTimer = window.setTimeout(() => goToNextScene(), 3200);
        transitionScheduled = true;
      }, 100);
    }
  };

  function syncScene2() {
    const stage = document.querySelector('.stage.scene-come-in');
    if (!stage) return;

    const card = stage.querySelector(':scope > article.scene-card');
    if (!card) return;

    stage.classList.add('ea64-scene2-controlled');
    hideNativeScene2(card);

    const layer = createLayer(card);
    const completedByUser = sessionStorage.getItem(COMPLETE_KEY) === '1';

    if (completedByUser) {
      stage.classList.remove('ea64-scene2-waiting');
      stage.classList.add('ea64-scene2-complete');
      renderComplete(layer);
      setNextEnabled(true);
    } else {
      stage.classList.add('ea64-scene2-waiting');
      stage.classList.remove('ea64-scene2-complete');
      renderWaiting(layer);
      setNextEnabled(false);
    }
  }

  document.addEventListener('click', event => {
    const restart = event.target.closest(
      '.scene-arrival .arrival-enter, .scene-arrival .enter-school-nav, .scene-final .secondary-action'
    );
    if (!restart) return;

    sessionStorage.removeItem(COMPLETE_KEY);
    resultAudioPlayed = false;
    clearTransition();
  });

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(syncScene2);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncScene2, { once: true });
  } else {
    syncScene2();
  }
})();
