(() => {
  if (window.__eaScenePickerV88Installed) return;
  window.__eaScenePickerV88Installed = true;

  const SCENES = [
    { id: 'arrival', title: 'Добро пожаловать в школу' },
    { id: 'come-in', title: 'Доброе утро' },
    { id: 'why-english', title: 'Зачем учить английский' },
    { id: 'languages', title: 'Языки мира' },
    { id: 'tongue', title: 'Английские язычки' },
    { id: 'names', title: 'Игра «Повторюшки»' },
    { id: 'many-toys', title: 'Много игрушек' },
    { id: 'dunno-arrives', title: 'Кто там?' },
    { id: 'age', title: 'Знакомство с Незнайкой' },
    { id: 'actions', title: 'Команды и движения' },
    { id: 'four-toys', title: 'Четыре игрушки' },
    { id: 'guess', title: 'Угадай игрушку' },
    { id: 'rhyme', title: 'Английский стишок' },
    { id: 'dunno-test', title: 'Проверяем Незнайку' },
    { id: 'likes', title: 'Делимся игрушками' },
    { id: 'nice-nasty', title: 'This и that' },
    { id: 'secret-bag', title: 'Сумка с секретом' },
    { id: 'roy', title: 'Песенка Роя' },
    { id: 'final', title: 'Завершение урока' }
  ];

  let busy = false;
  let observerScheduled = false;

  const normalize = value => (value || '').replace(/\s+/g, ' ').trim();

  const getCurrentIndex = () => {
    for (let index = 0; index < SCENES.length; index += 1) {
      if (document.querySelector(`.stage.scene-${SCENES[index].id}`)) return index;
    }

    const exactCounter = [...document.querySelectorAll('body *')]
      .find(element => /^(?:1[0-9]|[1-9])\s*\/\s*19$/.test(normalize(element.textContent)));
    const match = normalize(exactCounter?.textContent).match(/(\d+)\s*\/\s*19/);
    return match ? Math.max(0, Math.min(18, Number(match[1]) - 1)) : 0;
  };

  const findCounter = () => {
    const candidates = [...document.querySelectorAll('header *, body > div *')]
      .filter(element => /^(?:1[0-9]|[1-9])\s*\/\s*19$/.test(normalize(element.textContent)));
    return candidates.sort((a, b) => a.children.length - b.children.length)[0] || null;
  };

  const findLessonButton = direction => {
    const selector = direction === 'next'
      ? '.lesson-controls .next-button'
      : '.lesson-controls .back-button';
    const direct = document.querySelector(selector);
    if (direct) return direct;

    const pattern = direction === 'next'
      ? /(?:Следующая сцена|Войти в школу)/i
      : /^\s*←?\s*Назад\s*$/i;

    return [...document.querySelectorAll('button')]
      .find(button => !button.closest('.ea88-picker-dialog') && pattern.test(normalize(button.textContent))) || null;
  };

  const waitForIndexChange = (previousIndex, timeout = 1500) => new Promise(resolve => {
    const started = performance.now();
    const check = () => {
      const current = getCurrentIndex();
      if (current !== previousIndex) {
        resolve(current);
        return;
      }
      if (performance.now() - started >= timeout) {
        resolve(previousIndex);
        return;
      }
      window.setTimeout(check, 45);
    };
    check();
  });

  const forceClick = button => {
    if (!button) return;
    button.disabled = false;
    button.removeAttribute('disabled');
    button.setAttribute('aria-disabled', 'false');
    button.style.pointerEvents = 'auto';
    button.style.opacity = '1';
    button.click();
  };

  const moveOneScene = async direction => {
    const before = getCurrentIndex();
    let button = findLessonButton(direction);
    if (!button) return false;

    forceClick(button);
    let after = await waitForIndexChange(before);
    if (after !== before) return true;

    /* React can replace a disabled button during the first attempt. */
    button = findLessonButton(direction);
    if (!button) return false;
    forceClick(button);
    after = await waitForIndexChange(before);
    return after !== before;
  };

  const setBusyUi = (isBusy, targetIndex = null) => {
    busy = isBusy;
    const dialog = document.querySelector('.ea88-picker-dialog');
    dialog?.classList.toggle('is-busy', isBusy);
    dialog?.querySelectorAll('button').forEach(button => {
      if (!button.classList.contains('ea88-picker-close')) button.disabled = isBusy;
    });

    const status = dialog?.querySelector('.ea88-picker-status');
    if (status) {
      status.textContent = isBusy && targetIndex !== null
        ? `Переходим к сцене ${targetIndex + 1}…`
        : '';
    }
  };

  const updateUi = () => {
    const current = getCurrentIndex();
    document.querySelectorAll('.ea88-picker-open').forEach(button => {
      const number = button.querySelector('b');
      if (number && number.textContent !== String(current + 1)) {
        number.textContent = String(current + 1);
      }
      const label = `Открыть выбор сцены. Сейчас сцена ${current + 1}`;
      if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
    });

    const dialog = document.querySelector('.ea88-picker-dialog');
    dialog?.querySelectorAll('[data-ea88-scene]').forEach(button => {
      const active = Number(button.dataset.ea88Scene) === current;
      button.classList.toggle('is-active', active);
      const ariaCurrent = active ? 'step' : 'false';
      if (button.getAttribute('aria-current') !== ariaCurrent) {
        button.setAttribute('aria-current', ariaCurrent);
      }
    });
  };

  const closePicker = () => {
    if (busy) return;
    const overlay = document.querySelector('.ea88-picker-overlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('ea88-picker-opened');
    document.querySelector('.ea88-picker-open')?.focus({ preventScroll: true });
  };

  const openPicker = () => {
    ensureOverlay();
    updateUi();
    const overlay = document.querySelector('.ea88-picker-overlay');
    if (!overlay) return;
    overlay.hidden = false;
    document.documentElement.classList.add('ea88-picker-opened');
    overlay.querySelector('[data-ea88-scene].is-active, [data-ea88-scene]')?.focus({ preventScroll: true });
  };

  const jumpTo = async targetIndex => {
    if (busy) return;
    targetIndex = Math.max(0, Math.min(SCENES.length - 1, targetIndex));
    let current = getCurrentIndex();
    if (current === targetIndex) {
      closePicker();
      return;
    }

    setBusyUi(true, targetIndex);
    let attempts = 0;
    let failed = false;

    while (current !== targetIndex && attempts < 24) {
      const direction = targetIndex > current ? 'next' : 'back';
      const moved = await moveOneScene(direction);
      if (!moved) {
        failed = true;
        break;
      }
      current = getCurrentIndex();
      attempts += 1;
      updateUi();
      await new Promise(resolve => window.setTimeout(resolve, 80));
    }

    setBusyUi(false);
    const status = document.querySelector('.ea88-picker-status');

    if (failed || current !== targetIndex) {
      if (status) status.textContent = 'Не удалось перейти. Закрой окно и попробуй ещё раз.';
      return;
    }

    closePicker();
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateUi();
    }, 100);
  };

  const ensureOverlay = () => {
    if (document.querySelector('.ea88-picker-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'ea88-picker-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="ea88-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="ea88-picker-title">
        <div class="ea88-picker-heading">
          <div>
            <strong id="ea88-picker-title">Выбор сцены</strong>
            <small>Можно перейти сразу к любой части урока</small>
          </div>
          <button type="button" class="ea88-picker-close" aria-label="Закрыть">×</button>
        </div>
        <div class="ea88-picker-grid">
          ${SCENES.map((scene, index) => `
            <button type="button" data-ea88-scene="${index}">
              <b>${index + 1}</b>
              <span>${scene.title}</span>
            </button>
          `).join('')}
        </div>
        <div class="ea88-picker-status" aria-live="polite"></div>
      </section>
    `;

    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('.ea88-picker-close')) {
        closePicker();
        return;
      }
      const sceneButton = event.target.closest('[data-ea88-scene]');
      if (sceneButton) jumpTo(Number(sceneButton.dataset.ea88Scene));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !overlay.hidden) closePicker();
    });

    document.body.append(overlay);
  };

  const ensureHost = () => {
    ensureOverlay();
    if (document.querySelector('.ea88-picker-host')) {
      updateUi();
      return;
    }

    const counter = findCounter();
    if (!counter) return;

    const host = document.createElement('span');
    host.className = 'ea88-picker-host';
    host.innerHTML = `
      <button type="button" class="ea88-picker-open">
        <span>Сцена</span><b>1</b><i>▾</i>
      </button>
    `;
    host.querySelector('button').addEventListener('click', openPicker);
    counter.insertAdjacentElement('afterend', host);
    updateUi();
  };

  const scheduleEnsure = () => {
    if (observerScheduled) return;
    observerScheduled = true;
    requestAnimationFrame(() => {
      observerScheduled = false;
      ensureHost();
    });
  };

  new MutationObserver(scheduleEnsure).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', ensureHost, { once: true })
    : ensureHost();
})();
