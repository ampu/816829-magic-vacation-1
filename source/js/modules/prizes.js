import {addClassToken, isPortrait as calculatePortrait} from 'helpers/document-helpers';
import {ScreenId, addScreenListener, ScreenState} from 'helpers/screen-helpers';
import {FrameAnimation} from 'helpers/frame-animation';

const NUMBERS_ANIMATION_FPS = 12;

const casesNumbersContainer = document.querySelector(`.prizes__item--cases .prizes__desc b`);
const codesNumbersContainer = document.querySelector(`.prizes__item--codes .prizes__desc b`);

/**
 * @type {Array<{
 *   key: string,
 *   numbersAnimation?: FrameAnimation,
 * }>]}
 */
const prizes = [
  {
    key: `journeys`,
  },
  {
    key: `cases`,
    // 38.7s (1) - 39.3s (7)
    numbersAnimation: new FrameAnimation({
      delay: 5700,
      frames: [1, 2, 3, 4, 5, 6, 7],
      fps: NUMBERS_ANIMATION_FPS,
      onRenderFrame({frame: number}) {
        casesNumbersContainer.dataset.currentNumber = number;
      },
    }),
  },
  {
    key: `codes`,
    // 40.8 (11) - 41.5 (900)
    numbersAnimation: new FrameAnimation({
      delay: 7900,
      frames: [11, 185, 371, 514, 821, 849, 900],
      fps: NUMBERS_ANIMATION_FPS,
      onRenderFrame({frame: number}) {
        codesNumbersContainer.dataset.currentNumber = number;
      },
    }),
  },
];

export default () => {
  const prizesScreen = document.querySelector(`.screen--prizes`);

  const icons = prizes.map((prize) => ({
    iconContainer: document.querySelector(`.prizes__item--${prize.key} .prizes__icon`),
    portraitIconTemplate: document.querySelector(`#${prize.key}-portrait-icon-template`),
    landscapeIconTemplate: document.querySelector(`#${prize.key}-landscape-icon-template`),
  }));

  const state = {
    isPortrait: undefined,
  };

  const renderIcons = () => {
    for (const {iconContainer, portraitIconTemplate, landscapeIconTemplate} of icons) {
      const adaptiveIconTemplate = state.isPortrait
        ? portraitIconTemplate
        : landscapeIconTemplate;

      iconContainer.replaceChild(adaptiveIconTemplate.content.cloneNode(true), iconContainer.firstElementChild);
    }

    addClassToken(prizesScreen, `first-glance`);
  };

  const isPortraitChanged = () => {
    const isPortrait = calculatePortrait();
    if (state.isPortrait === isPortrait) {
      return false;
    }
    state.isPortrait = isPortrait;
    return true;
  };

  const activateNumbersAnimationsIfNeeded = () => {
    prizes.forEach(({numbersAnimation}) => {
      if (!numbersAnimation) {
        return;
      }
      if (state.isPortrait) {
        numbersAnimation.stop();
        return;
      }
      if (!numbersAnimation.hasStarted()) {
        numbersAnimation.start();
      }
    });
  };

  const onWindowResize = (_evt) => {
    if (isPortraitChanged()) {
      renderIcons();
      activateNumbersAnimationsIfNeeded();
    }
  };

  addScreenListener([ScreenId.PRIZES], (screen) => {
    if (screen.state === ScreenState.ACTIVE) {
      if (isPortraitChanged()) {
        renderIcons();
        activateNumbersAnimationsIfNeeded();
      }
      window.addEventListener(`resize`, onWindowResize);
    } else {
      window.removeEventListener(`resize`, onWindowResize);
    }
  });
};
