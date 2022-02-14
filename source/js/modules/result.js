import {reloadSvg} from 'helpers/document-helpers';
import {ScreenEventType, dispatchScreenEvent, ScreenId} from 'helpers/screen-helpers';
import seaCalfScene from 'scenes/sea-calf-scene/sea-calf-scene';
import crocodileScene from 'scenes/crocodile-scene/crocodile-scene';

export default () => {
  const showResultButtons = Array.from(document.querySelectorAll(`.js-show-result`));
  const playButton = document.querySelector(`.js-play`);
  const messagesContainer = document.getElementById(`messages`);
  const messageField = document.getElementById(`message-field`);

  const state = {
    activeScene: null,
  };

  const results = Array.prototype.map.call(document.querySelectorAll(`.screen--result`), (element, index) => {
    return {
      index,
      id: element.id,
      element,
      svg: element.querySelector(`.result__title svg`),
    };
  });

  const hideResult = (result) => {
    result.element.classList.replace(`screen--show`, `screen--hidden`);
  };

  const showResult = (result) => {
    reloadSvg(result.element.querySelector(`.result__title svg`));

    result.element.classList.remove(`screen--hidden`);
    requestAnimationFrame(() => {
      result.element.classList.add(`screen--show`);
    });
  };

  const initResults = () => {
    showResultButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        const currentResult = results.find((result) => result.id === button.dataset.target);

        results.forEach(hideResult);
        showResult(currentResult);

        dispatchScreenEvent(ScreenEventType.SCREEN_CHANGE, currentResult);
      });
    });
  };

  const initPlayButton = () => {
    playButton.addEventListener(`click`, () => {
      results.forEach(hideResult);
      messagesContainer.innerHTML = ``;
      messageField.focus();
    });
  };

  const onScreenChange = (evt) => {
    const {currentScreen} = evt.detail;

    if (state.activeScene) {
      state.activeScene.deactivate();
      state.activeScene = null;
    }

    if (currentScreen.id === ScreenId.RESULT_TRIP) {
      state.activeScene = seaCalfScene;
    } else if (currentScreen.id === ScreenId.RESULT_NEGATIVE) {
      state.activeScene = crocodileScene;
    }

    if (state.activeScene) {
      state.activeScene.activate();
    }
  };

  document.body.addEventListener(ScreenEventType.SCREEN_CHANGE, onScreenChange);

  initResults();
  initPlayButton();

  setTimeout(() => {
    showResultButtons[2].click();
  });
};
