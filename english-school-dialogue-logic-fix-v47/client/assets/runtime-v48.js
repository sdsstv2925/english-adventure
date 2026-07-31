(() => {
  const run = () => {
    document.querySelectorAll('.brand small').forEach(element => {
      if (element.textContent.includes('VERSION 47')) {
        element.textContent = element.textContent.replace('VERSION 47', 'VERSION 48');
      }
    });
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run, { once: true })
    : run();
})();

(() => {
  if (window.__eaScene11FixV69Installed) return;
  window.__eaScene11FixV69Installed = true;
  window.__eaFourToysUnlocked = false;

  const resetLessonState = event => {
    if (!event.target.closest('.scene-final .secondary-action')) return;
    window.__eaFourToysUnlocked = false;
  };

  const buildCountCard = (stage, wordCard) => {
    const existing = stage.querySelector('.count-first-card');
    if (existing) return existing;

    const card = document.createElement('div');
    card.className = 'count-first-card';
    card.innerHTML = `
      <b>Сколько игрушек на столе?</b>
      <div class="count-first-options" role="group" aria-label="Выбери количество игрушек">
        <button type="button" data-answer="3">3</button>
        <button type="button" data-answer="4">4</button>
        <button type="button" data-answer="5">5</button>
      </div>
      <div class="count-first-message" aria-live="polite"></div>
    `;

    wordCard.before(card);
    const message = card.querySelector('.count-first-message');
    const buttons = [...card.querySelectorAll('button[data-answer]')];

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.remove('correct', 'wrong'));

        if (button.dataset.answer === '4') {
          window.__eaFourToysUnlocked = true;
          button.classList.add('correct');
          buttons.forEach(item => {
            item.disabled = true;
          });
          message.textContent = 'Правильно! На столе четыре игрушки.';
          message.classList.remove('is-wrong');
          message.classList.add('is-correct');

          window.setTimeout(() => {
            card.remove();
            wordCard.removeAttribute('data-count-locked');
            wordCard.classList.add('ea69-word-card-visible');
          }, 650);
          return;
        }

        button.classList.add('wrong');
        message.textContent = 'Посчитай ещё раз: медведь, заяц, собака и лягушка.';
        message.classList.remove('is-correct');
        message.classList.add('is-wrong');
      });
    });

    return card;
  };

  const enhance = () => {
    const stage = document.querySelector('.stage.scene-four-toys');
    if (!stage) return;

    const wordCard = stage.querySelector('.word-card');
    const tableToys = stage.querySelector('.table-toys');
    if (!wordCard) return;

    stage.classList.add('ea69-scene11-controlled');
    tableToys?.setAttribute('aria-hidden', 'true');

    if (window.__eaFourToysUnlocked) {
      stage.querySelector('.count-first-card')?.remove();
      wordCard.removeAttribute('data-count-locked');
      wordCard.classList.add('ea69-word-card-visible');
      return;
    }

    wordCard.setAttribute('data-count-locked', 'true');
    wordCard.classList.remove('ea69-word-card-visible');
    buildCountCard(stage, wordCard);
  };

  document.addEventListener('click', resetLessonState, true);
  new MutationObserver(enhance).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', enhance, { once: true })
    : enhance();
})();

(() => {
  if (window.__eaRoySongFixInstalled) return;
  window.__eaRoySongFixInstalled = true;

  const installStyles = () => {
    if (document.getElementById('ea-roy-song-style')) return;
    const style = document.createElement('style');
    style.id = 'ea-roy-song-style';
    style.textContent = '@media(min-width:881px){.scene-roy .song-card{left:50%!important;right:auto!important;bottom:116px!important;top:auto!important;width:56%!important;max-width:56%!important;height:auto!important;max-height:none!important;min-height:138px!important;padding:18px 24px!important;transform:translateX(-50%)!important;overflow:hidden!important;border-radius:24px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important}.scene-roy .song-card.ea-roy-ready>:not(button):not(.primary-action):not(.ea-roy-helper){display:none!important}.scene-roy .song-card.ea-roy-playing{min-height:230px!important}.scene-roy .song-card.ea-roy-playing>:not(.ea-roy-helper){display:revert}.scene-roy .song-card .ea-roy-helper{font-size:18px;font-weight:800;color:#31546b;text-align:center}.scene-roy .song-card.ea-roy-playing .ea-roy-helper{display:none}.scene-roy .choice-row{left:50%!important;right:auto!important;bottom:18px!important;top:auto!important;width:56%!important;max-width:56%!important;min-height:82px!important;padding:14px 20px!important;transform:translateX(-50%)!important;border-radius:22px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:18px!important;z-index:450!important}.scene-roy .choice-row[data-roy-locked="true"]{visibility:hidden!important;pointer-events:none!important}.scene-roy .choice-row.ea-roy-unlocked{visibility:visible!important;pointer-events:auto!important}.scene-roy .choice-row .ea-roy-question{font-size:20px;font-weight:900;color:#173a57;margin-right:18px;white-space:nowrap}.scene-roy .choice-row button{min-width:105px!important;min-height:54px!important}.scene-roy .song-card:before,.scene-roy .song-card:after,.scene-roy .choice-row:before,.scene-roy .choice-row:after{display:none!important}}@media(max-width:880px){.scene-roy .choice-row[data-roy-locked="true"]{display:none!important}.scene-roy .choice-row.ea-roy-unlocked{display:flex!important}.scene-roy .choice-row .ea-roy-question{width:100%;text-align:center;font-weight:900;color:#173a57}.scene-roy .choice-row{flex-wrap:wrap!important}.scene-roy .song-card .ea-roy-helper{text-align:center;font-weight:800;color:#31546b}}';
    document.head.appendChild(style);
  };

  const unlock = stage => {
    const choices = stage.querySelector('.choice-row');
    if (!choices) return;
    choices.removeAttribute('data-roy-locked');
    choices.classList.add('ea-roy-unlocked');

    if (!choices.querySelector('.ea-roy-question')) {
      const question = document.createElement('div');
      question.className = 'ea-roy-question';
      question.textContent = 'How old is Roy?';
      choices.prepend(question);
    }
  };

  const enhance = () => {
    installStyles();
    const stage = document.querySelector('.scene-roy');
    if (!stage) return;

    const card = stage.querySelector('.song-card');
    const choices = stage.querySelector('.choice-row');
    if (!card || !choices) return;

    if (!stage.dataset.roySongStarted) {
      choices.setAttribute('data-roy-locked', 'true');
      card.classList.add('ea-roy-ready');

      if (!card.querySelector('.ea-roy-helper')) {
        const helper = document.createElement('div');
        helper.className = 'ea-roy-helper';
        helper.textContent = 'Послушай песню и узнай, сколько лет Рою';
        card.querySelector('button,.primary-action')?.after(helper);
      }
    }

    const playButton = card.querySelector('button,.primary-action');
    if (!playButton || playButton.dataset.roySongBound) return;

    playButton.dataset.roySongBound = 'true';
    playButton.addEventListener('click', () => {
      stage.dataset.roySongStarted = 'true';
      card.classList.remove('ea-roy-ready');
      card.classList.add('ea-roy-playing');
      let unlocked = false;

      const finish = () => {
        if (unlocked) return;
        unlocked = true;
        card.classList.remove('ea-roy-playing');
        card.classList.add('ea-roy-finished');
        unlock(stage);
      };

      window.setTimeout(() => {
        const audio = [...document.querySelectorAll('audio')].find(item => !item.paused);
        if (!audio) return;
        audio.addEventListener('ended', finish, { once: true });
        audio.addEventListener('error', finish, { once: true });
      }, 250);

      window.setTimeout(finish, 22000);
    });
  };

  new MutationObserver(enhance).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', enhance, { once: true })
    : enhance();
})();
