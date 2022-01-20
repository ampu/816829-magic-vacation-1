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

export {
  ScreenId,
  ScreenState,
  ScreenEventType,
  setScreenState,
  getScreenIdByLocation,
  dispatchScreenEvent,
};
