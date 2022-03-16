import throttle from 'lodash/throttle';
import clamp from 'lodash/clamp';
import {ScreenState, ScreenEventType, setScreenState, getScreenIdByLocation, dispatchScreenEvent} from 'helpers/screen-helpers';
import {scrollIntoViewIfNeeded} from 'helpers/document-helpers';

const Timeout = {
  DOCUMENT_WHEEL: 1000,
  PREVIOUS_SCREEN_HIDDEN: 1000,
  CURRENT_SCREEN_ACTIVE: 500,
};

class FullPageScroll {
  constructor() {
    this.menus = Array.prototype.map.call(document.querySelectorAll(`.page-header__menu .js-menu-link`), (element, index) => {
      return {
        index,
        screenId: element.dataset.screenId,
        element,
      };
    });
    this.activeMenu = null;

    this.screens = Array.prototype.map.call(document.querySelectorAll(`.screen:not(.screen--result)`), (element, index) => {
      return {
        state: ScreenState.HIDDEN,
        index,
        id: element.id,
        element,
        footerElement: element.querySelector(`.screen__footer, .disclaimer`),
      };
    });
    this.currentScreen = null;
    this.onCurrentScreenActive = null;
    this.activateCurrentScreenTimeoutId = 0;
    this.previousScreen = null;
    this.onPreviousScreenHidden = null;
    this.previousScreenHiddenTimeoutId = 0;

    this.onDocumentWheelHandler = throttle(this.onDocumentWheel.bind(this), Timeout.DOCUMENT_WHEEL, {
      leading: false,
      trailing: true,
    });
    this.onWindowPopStateHandler = this.onWindowPopState.bind(this);
    this.onWindowResizeHandler = this.onWindowResize.bind(this);
  }

  setCurrentScreenIndex(index) {
    this.previousScreen = this.currentScreen;
    this.currentScreen = this.screens[clamp(index, 0, this.screens.length - 1)];

    if (this.previousScreen === this.currentScreen) {
      this.previousScreen = null;
    }

    this.activeMenu = this.menus.find((menu) => menu.screenId === this.currentScreen.id);

    this.activateMenuItem();
    this.deactivatePreviousScreen();
    this.activateCurrentScreen();
    dispatchScreenEvent(ScreenEventType.SCREEN_CHANGE, this.currentScreen, this.previousScreen);
  }

  init() {
    // document.addEventListener(`wheel`, this.onDocumentWheelHandler);
    window.addEventListener(`popstate`, this.onWindowPopStateHandler);
    window.addEventListener(`resize`, this.onWindowResizeHandler);

    this.onWindowPopState();
    this.onWindowResize();
  }

  onDocumentWheel(evt) {
    const step = Math.sign(evt.deltaY);
    if (step) {
      this.setCurrentScreenIndex(this.currentScreen.index + step);
    }
  }

  onWindowPopState() {
    const screenId = getScreenIdByLocation();
    this.setCurrentScreenIndex(this.screens.findIndex((screen) => screenId === screen.id));
  }

  onWindowResize() {
    scrollIntoViewIfNeeded(document.getElementById(getScreenIdByLocation()));
  }

  activateMenuItem() {
    this.menus.forEach((menu) => {
      menu.element.classList.toggle(`active`, menu === this.activeMenu);
    });
  }

  deactivatePreviousScreen() {
    if (this.onPreviousScreenHidden) {
      this.onPreviousScreenHidden();
    }

    if (this.previousScreen && this.previousScreen.footerElement) {
      this.previousScreen.footerElement.classList.toggle(`static`, this.currentScreen.footerElement);
    }

    setScreenState(this.previousScreen, ScreenState.DEACTIVATED);

    this.onPreviousScreenHidden = () => {
      clearTimeout(this.previousScreenHiddenTimeoutId);
      this.onPreviousScreenHidden = null;

      setScreenState(this.previousScreen, ScreenState.HIDDEN);
      dispatchScreenEvent(ScreenEventType.PREVIOUS_SCREEN_HIDDEN, this.currentScreen, this.previousScreen);
    };

    this.previousScreenHiddenTimeoutId = setTimeout(this.onPreviousScreenHidden, Timeout.PREVIOUS_SCREEN_HIDDEN);
  }

  activateCurrentScreen() {
    if (this.onCurrentScreenActive) {
      this.onCurrentScreenActive();
    }

    if (this.currentScreen.footerElement) {
      this.currentScreen.footerElement.classList.toggle(`static`, this.previousScreen && this.previousScreen.footerElement);
    }

    setScreenState(this.currentScreen, ScreenState.CURRENT);

    this.onCurrentScreenActive = () => {
      clearTimeout(this.activateCurrentScreenTimeoutId);
      this.onCurrentScreenActive = null;

      setScreenState(this.currentScreen, ScreenState.ACTIVE);
      dispatchScreenEvent(ScreenEventType.CURRENT_SCREEN_ACTIVE, this.currentScreen, this.previousScreen);
    };

    this.activateCurrentScreenTimeoutId = setTimeout(this.onCurrentScreenActive, Timeout.CURRENT_SCREEN_ACTIVE);
  }
}

export default () => {
  const fullPageScroll = new FullPageScroll();
  fullPageScroll.init();
};
