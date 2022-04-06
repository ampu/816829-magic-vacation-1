import {addScreenListener, ScreenId, ScreenState} from 'helpers/screen-helpers';
import {isStopScaling as calculateStopScaling} from 'helpers/document-helpers';

const SonyaSize = {
  ADAPTIVE: {
    right: -8.5,
    width: 32.7,
    height: 36.9,
    unit: `rem`,
    vibe: 2,
  },
  FIXED: {
    right: -85,
    width: 327,
    height: 369,
    unit: `px`,
    vibe: 20,
  },
};

export default () => {
  const sonya = document.querySelector(`.sonya`);

  let size = SonyaSize.ADAPTIVE;
  let foreground = null;
  let background = null;
  let isStopScaling = calculateStopScaling();

  const initForeground = () => {
    if (foreground) {
      return;
    }

    foreground = sonya.animate([
      {transform: `translate(${size.width + size.right}${size.unit}, ${size.height}${size.unit})`},
      {transform: `translate(0${size.unit}, 0${size.unit})`},
    ], {
      fill: `both`,
      delay: 2900, // 0:47.8
      iterationDuration: 900,
      easing: `ease-out`,
    });

    foreground.cancel();
  };

  const onForegroundFinish = () => {
    background.play();
  };

  const initBackground = () => {
    if (background || !foreground) {
      return;
    }

    background = sonya.animate([
      {transform: `translateY(0${size.unit})`},
      {transform: `translateY(${size.vibe}${size.unit})`},
    ], {
      pseudoElement: `::before`,
      fill: `both`,
      direction: `alternate`,
      delay: 300, // 49.0
      iterationDuration: 1000,
      iterations: Infinity,
      easing: `ease-in-out`,
    });

    foreground.addEventListener(`finish`, onForegroundFinish);

    background.cancel();
  };

  const createAnimations = () => {
    initForeground();
    initBackground();
  };

  const destroyAnimations = () => {
    if (foreground && background) {
      foreground.removeEventListener(`finish`, onForegroundFinish);
    }
    if (foreground) {
      foreground.cancel();
      foreground = null;
    }
    if (background) {
      background.cancel();
      background = null;
    }
  };

  const isStopScalingChanged = () => {
    const currentValue = calculateStopScaling();
    if (isStopScaling === currentValue) {
      return false;
    }
    isStopScaling = currentValue;
    return true;
  };

  const onWindowResize = () => {
    if (isStopScalingChanged()) {
      destroyAnimations();
    }
  };

  addScreenListener(ScreenId.GAME, {
    [ScreenState.CURRENT]: () => {
      createAnimations();
      window.addEventListener(`resize`, onWindowResize);
    },
    [ScreenState.ACTIVE]: () => {
      foreground.play();
    },
    [ScreenState.DEACTIVATED]: () => {
      background.pause();
      foreground.updatePlaybackRate(2);
      foreground.reverse();
    },
    [ScreenState.HIDDEN]: () => {
      window.removeEventListener(`resize`, onWindowResize);
      destroyAnimations();
    },
  });
};
