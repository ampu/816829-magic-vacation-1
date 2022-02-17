/** @enum {string} */
const ScreenId = {
  PRIZES: `prizes`,
  GAME: `game`,
  RESULT_TRIP: `result`,
  RESULT_PRIZE: `result2`,
  RESULT_NEGATIVE: `result3`,
};

/** @enum {string} */
const ScreenState = {
  HIDDEN: `hidden`,
  CURRENT: `current`,
  ACTIVE: `active`,
  DEACTIVATED: `deactivated`,
  ANY: `any`,
};

/** @enum {string} */
const ScreenEventType = {
  SCREEN_CHANGE: `screenchange`,
  PREVIOUS_SCREEN_HIDDEN: `previousscreenhidden`,
  CURRENT_SCREEN_ACTIVE: `currentscreenactive`,
};

/**
 * @param {{element: Element}} screen
 * @param {ScreenState} state
 */
const setScreenState = (screen, state) => {
  if (!screen) {
    return;
  }

  screen.state = state;

  switch (state) {
    case ScreenState.HIDDEN:
      screen.element.classList.remove(`active`, `deactivated`);
      screen.element.classList.add(`screen--hidden`);
      break;

    case ScreenState.CURRENT:
      screen.element.classList.remove(`active`, `deactivated`, `screen--hidden`);
      break;

    case ScreenState.ACTIVE:
      screen.element.classList.add(`active`);
      break;

    case ScreenState.DEACTIVATED:
      screen.element.classList.add(`deactivated`);
      break;
  }
};

const getScreenIdByLocation = () => {
  return window.location.hash.substring(1);
};

const dispatchScreenEvent = (screenEventType, currentScreen, previousScreen) => {
  document.body.dispatchEvent(new CustomEvent(screenEventType, {
    detail: {
      currentScreen,
      previousScreen,
    },
  }));
};

/**
 * @typedef {{
 *   state: ScreenState,
 *   index: number,
 *   id: string,
 *   element: HTMLElement,
 * }} Screen
 *
 * @typedef {function(screen: Screen): void} ScreenCallback
 *
 * @param {number | number[]} screenIds
 * @param {ScreenCallback | object<ScreenState, ScreenCallback>} callbacks
 */
const addScreenListener = (screenIds, callbacks) => {
  if (!Array.isArray(screenIds)) {
    screenIds = [screenIds];
  }
  if (typeof (callbacks) === `function`) {
    callbacks = {
      [ScreenState.ANY]: callbacks,
    };
  }

  const notifyIfNeeded = (screen) => {
    if (screen && screenIds.includes(screen.id)) {
      if (callbacks[ScreenState.ANY]) {
        callbacks[ScreenState.ANY].call(null, screen);
      }
      if (callbacks[screen.state]) {
        callbacks[screen.state].call(null, screen);
      }
    }
  };

  const onScreenChange = (evt) => {
    const {currentScreen, previousScreen} = evt.detail;
    notifyIfNeeded(previousScreen);
    notifyIfNeeded(currentScreen);
  };

  const onPreviousScreenHidden = (evt) => {
    const {previousScreen} = evt.detail;
    notifyIfNeeded(previousScreen);
  };

  const onCurrentScreenActive = (evt) => {
    const {currentScreen} = evt.detail;
    notifyIfNeeded(currentScreen);
  };

  document.body.addEventListener(ScreenEventType.SCREEN_CHANGE, onScreenChange);
  document.body.addEventListener(ScreenEventType.PREVIOUS_SCREEN_HIDDEN, onPreviousScreenHidden);
  document.body.addEventListener(ScreenEventType.CURRENT_SCREEN_ACTIVE, onCurrentScreenActive);
};

export {
  ScreenId,
  ScreenState,
  ScreenEventType,
  setScreenState,
  getScreenIdByLocation,
  dispatchScreenEvent,
  addScreenListener,
};
