(() => {
  if (window.__eaScene2V63Installed) return;
  window.__eaScene2V63Installed = true;

  const COMPLETE_KEY = 'english-adventure-scene2-user-complete-v63';
  let goodMorningPlayed = false;
  let replayAudio = null;

  const playFile = src => {
    if (replayAudio) {
      replayAudio.pause();
      replayAudio.src = '';
    }
    replayAudio = new Audio(src);
    replayAudio.volume = 0.96;
    replayAudio.play().catch(() => {});
  };

  const setNextEnabled = enabled => {
    const next = document.querySelector('.lesson-controls .next-button');
    if (!next) return;

    next.disabled = !enabled;
    next.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    next.classList.toggle('ea63-scene2-locked', !enabled);
  };

  const buildFlow = content => {
    let flow = content.querySelector(':scope > .ea63-scene2-flow');
    if (flow) return flow;

    flow = document.createElement('div');
    flow.className = 'ea63-scene2-flow';
    flow.innerHTML = `
      <div class="ea63-scene2-caption">
        <div class="ea63-scene2-copy">
          <strong>Come in, boys and girls!</strong>
          <span>Sit down! Sit on the chairs!</span>
          <small>Входите, мальчики и девочки! Садитесь на стулья.</small>
        </div>
        <button type="button" class="ea63-scene2-sound" aria-label="Послушать приглашение учительницы">🔊</button>
      </div>
      <div class="ea63-scene2-task">
        <span>Послушай учительницу и помоги детям занять свои места.</span>
        <button type="button" class="ea63-scene2-seat">🪑 Сесть на стулья</button>
      </div>
    `;

    flow.querySelector('.ea63-scene2-sound')?.addEventListener('click', () => {
      playFile('/audio/voice/come-in.mp3?v=63');
    });

    flow.querySelector('.ea63-scene2-seat')?.addEventListener('click', event => {
      sessionStorage.setItem(COMPLETE_KEY, '1');
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Дети садятся…';
      syncScene2();
    });

    content.append(flow);
    return flow;
  };

  const hideNativeBeforeAction = content => {
    [...content.children].forEach(element => {
      if (element.matches('.speech, .seating-progress')) {
        element.style.setProperty('display', 'none', 'important');
        element.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const showGoodMorning = (stage, content, girlSpeech) => {
    content.querySelector(':scope > .ea63-scene2-flow')?.remove();

    [...content.children].forEach(element => {
      if (element.matches('.speech') && element !== girlSpeech) {
        element.style.setProperty('display', 'none', 'important');
        element.setAttribute('aria-hidden', 'true');
      }
    });

    girlSpeech.style.removeProperty('display');
    girlSpeech.removeAttribute('aria-hidden');
    stage.classList.remove('ea63-scene2-waiting');
    stage.classList.add('ea63-scene2-complete');
    setNextEnabled(true);

    if (!goodMorningPlayed) {
      goodMorningPlayed = true;
      const soundButton = girlSpeech.querySelector('.round-sound');
      if (soundButton) {
        window.setTimeout(() => soundButton.click(), 80);
      } else {
        playFile('/audio/voice-girl/good-morning.mp3?v=63');
      }
    }
  };

  function syncScene2() {
    const stage = document.querySelector('.stage.scene-come-in');
    if (!stage) return;

    const content = stage.querySelector(':scope > article.scene-card > .scene-content');
    if (!content) return;

    stage.classList.add('ea63-scene2-controlled');

    const userCompleted = sessionStorage.getItem(COMPLETE_KEY) === '1';
    const girlSpeech = content.querySelector(':scope > .speech-girl');

    if (!userCompleted) {
      stage.classList.add('ea63-scene2-waiting');
      stage.classList.remove('ea63-scene2-complete');
      hideNativeBeforeAction(content);
      buildFlow(content);
      setNextEnabled(false);
      return;
    }

    if (girlSpeech) {
      showGoodMorning(stage, content, girlSpeech);
      return;
    }

    stage.classList.add('ea63-scene2-waiting');
    const flow = buildFlow(content);
    const button = flow.querySelector('.ea63-scene2-seat');
    if (button) {
      button.disabled = true;
      button.textContent = 'Дети садятся…';
    }
    hideNativeBeforeAction(content);
    setNextEnabled(false);
  }

  document.addEventListener('click', event => {
    const restart = event.target.closest(
      '.scene-arrival .arrival-enter, .scene-arrival .enter-school-nav, .scene-final .secondary-action'
    );
    if (!restart) return;

    sessionStorage.removeItem(COMPLETE_KEY);
    goodMorningPlayed = false;
  });

  const observer = new MutationObserver(syncScene2);
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
