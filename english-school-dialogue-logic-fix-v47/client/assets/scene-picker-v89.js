(() => {
  if (window.__eaScenePickerV89Installed) return;
  window.__eaScenePickerV89Installed = true;
  window.__eaScenePickerV88Installed = true;

  const SCENES = [
    ['arrival', 'Добро пожаловать в школу'],
    ['come-in', 'Доброе утро'],
    ['why-english', 'Зачем учить английский'],
    ['languages', 'Языки мира'],
    ['tongue', 'Английские язычки'],
    ['names', 'Игра «Повторюшки»'],
    ['many-toys', 'Много игрушек'],
    ['dunno-arrives', 'Кто там?'],
    ['age', 'Знакомство с Незнайкой'],
    ['actions', 'Команды и движения'],
    ['four-toys', 'Четыре игрушки'],
    ['guess', 'Угадай игрушку'],
    ['rhyme', 'Английский стишок'],
    ['dunno-test', 'Проверяем Незнайку'],
    ['likes', 'Делимся игрушками'],
    ['nice-nasty', 'This и that'],
    ['secret-bag', 'Сумка с секретом'],
    ['roy', 'Песенка Роя'],
    ['final', 'Завершение урока']
  ];

  let busy = false;
  let scheduled = false;

  const normalize = value => (value || '').replace(/\s+/g, ' ').trim();

  const getCurrentIndex = () => {
    for (let index = 0; index < SCENES.length; index += 1) {
      if (document.querySelector(`.stage.scene-${SCENES[index][0]}`)) return index;
    }
    const counter = [...document.querySelectorAll('body *')]
      .find(element => /^(?:1[0-9]|[1-9])\s*\/\s*19$/.test(normalize(element.textContent)));
    const match = normalize(counter?.textContent).match(/(\d+)\s*\/\s*19/);
    return match ? Math.max(0, Math.min(18, Number(match[1]) - 1)) : 0;
  };

  const findCounter = () => [...document.querySelectorAll('header *, body > div *')]
    .filter(element => /^(?:1[0-9]|[1-9])\s*\/\s*19$/.test(normalize(element.textContent)))
    .sort((a, b) => a.children.length - b.children.length)[0] || null;

  const getFiber = node => {
    if (!node) return null;
    const key = Object.keys(node).find(name =>
      name.startsWith('__reactFiber$') || name.startsWith('__reactInternalInstance$')
    );
    return key ? node[key] : null;
  };

  const collectHooks = firstHook => {
    const hooks = [];
    let hook = firstHook;
    while (hook && hooks.length < 24) {
      hooks.push(hook);
      hook = hook.next;
    }
    return hooks;
  };

  const getLessonController = () => {
    const stage = document.querySelector('.stage');
    let fiber = getFiber(stage);
    const current = getCurrentIndex();

    while (fiber) {
      const firstHook = fiber.memoizedState;
      if (
        firstHook &&
        typeof firstHook.memoizedState === 'number' &&
        typeof firstHook.queue?.dispatch === 'function'
      ) {
        const hooks = collectHooks(firstHook);
        const looksLikeLesson =
          hooks.length >= 12 &&
          firstHook.memoizedState === current &&
          typeof hooks[1]?.memoizedState === 'number' &&
          hooks[2]?.memoizedState &&
          typeof hooks[2].memoizedState === 'object' &&
          typeof hooks[3]?.memoizedState === 'number' &&
          typeof hooks[7]?.memoizedState === 'number' &&
          typeof hooks[8]?.memoizedState === 'number';

        if (looksLikeLesson) return { fiber, hooks };
      }
      fiber = fiber.return;
    }

    return null;
  };

  const dispatchHook = (hooks, index, value) => {
    const dispatch = hooks[index]?.queue?.dispatch;
    if (typeof dispatch === 'function') dispatch(value);
  };

  const stopAudio = () => {
    document.querySelectorAll('audio').forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    });
    try { window.speechSynthesis?.cancel(); } catch {}
    window.dispatchEvent(new CustomEvent('lesson-character-speak', {
      detail: { who: null, text: '' }
    }));
  };

  const directJump = targetIndex => {
    const controller = getLessonController();
    if (!controller) return false;

    const { hooks } = controller;
    stopAudio();

    /* This mirrors the lesson's own U() reset function. */
    dispatchHook(hooks, 3, 0);
    dispatchHook(hooks, 4, '');
    dispatchHook(hooks, 5, '');
    dispatchHook(hooks, 7, 0);
    dispatchHook(hooks, 8, 0);
    dispatchHook(hooks, 9, 0);
    dispatchHook(hooks, 10, 2);
    dispatchHook(hooks, 11, []);

    /* First hook is the real scene number useState. */
    dispatchHook(hooks, 0, targetIndex);
    return true;
  };

  const waitForScene = (targetIndex, timeout = 1800) => new Promise(resolve => {
    const started = performance.now();
    const check = () => {
      if (getCurrentIndex() === targetIndex) {
        resolve(true);
        return;
      }
      if (performance.now() - started >= timeout) {
        resolve(false);
        return;
      }
      window.setTimeout(check, 40);
    };
    check();
  });

  const setBusy = (value, targetIndex = null) => {
    busy = value;
    const dialog = document.querySelector('.ea88-picker-dialog');
    dialog?.classList.toggle('is-busy', value);
    dialog?.querySelectorAll('[data-ea88-scene]').forEach(button => {
      button.disabled = value;
    });
    const status = dialog?.querySelector('.ea88-picker-status');
    if (status) {
      status.textContent = value && targetIndex !== null
        ? `Открываем сцену ${targetIndex + 1}…`
        : '';
    }
  };

  const updateUi = () => {
    const current = getCurrentIndex();
    document.querySelectorAll('.ea88-picker-open').forEach(button => {
      const number = button.querySelector('b');
      if (number && number.textContent !== String(current + 1)) number.textContent = String(current + 1);
      button.setAttribute('aria-label', `Открыть выбор сцены. Сейчас сцена ${current + 1}`);
    });
    document.querySelectorAll('[data-ea88-scene]').forEach(button => {
      const active = Number(button.dataset.ea88Scene) === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
  };

  const closePicker = (force = false) => {
    if (busy && !force) return;
    const overlay = document.querySelector('.ea88-picker-overlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('ea88-picker-opened');
  };

  const jumpTo = async targetIndex => {
    if (busy) return;
    targetIndex = Math.max(0, Math.min(18, Number(targetIndex)));

    if (getCurrentIndex() === targetIndex) {
      closePicker(true);
      return;
    }

    setBusy(true, targetIndex);
    const dispatched = directJump(targetIndex);
    const changed = dispatched ? await waitForScene(targetIndex) : false;

    if (!changed) {
      setBusy(false);
      const status = document.querySelector('.ea88-picker-status');
      if (status) status.textContent = 'Переход не выполнен. Обнови страницу и попробуй ещё раз.';
      return;
    }

    setBusy(false);
    updateUi();
    closePicker(true);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
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
              <b>${index + 1}</b><span>${scene[1]}</span>
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
      const button = event.target.closest('[data-ea88-scene]');
      if (button) jumpTo(button.dataset.ea88Scene);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !overlay.hidden) closePicker();
    });
    document.body.appendChild(overlay);
  };

  const openPicker = () => {
    ensureOverlay();
    updateUi();
    const overlay = document.querySelector('.ea88-picker-overlay');
    overlay.hidden = false;
    document.documentElement.classList.add('ea88-picker-opened');
    overlay.querySelector('.is-active,[data-ea88-scene]')?.focus({ preventScroll: true });
  };

  const ensureHost = () => {
    ensureOverlay();
    if (!document.querySelector('.ea88-picker-host')) {
      const counter = findCounter();
      if (!counter) return;
      const host = document.createElement('span');
      host.className = 'ea88-picker-host';
      host.innerHTML = '<button type="button" class="ea88-picker-open"><span>Сцена</span><b>1</b><i>▾</i></button>';
      host.querySelector('button').addEventListener('click', openPicker);
      counter.insertAdjacentElement('afterend', host);
    }
    updateUi();
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureHost();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', ensureHost, { once: true })
    : ensureHost();
})();
