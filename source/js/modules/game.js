import {ScreenEventType, ScreenId} from 'helpers/screen-helpers';
import {MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE} from 'helpers/time-helpers';
import {FrameAnimation} from 'helpers/frame-animation';
import {StateStorage} from 'helpers/state-storage';

const COUNTER_SECONDS = 5 * SECONDS_IN_MINUTE;
const COUNTER_ANIMATION_FPS = 1;

const NUMBER_FORMAT = {
  length: 2,
  fillString: `0`,
};

const formatNumber = (value) => {
  return `${value}`.padStart(NUMBER_FORMAT.length, NUMBER_FORMAT.fillString);
};

export default () => {
  const storage = new StateStorage(sessionStorage, `magic-vacation__game-counter--akimutin-v1`);

  const gameCounter = document.querySelector(`.game__counter`);

  const counterAnimation = new FrameAnimation({
    duration: COUNTER_SECONDS * MILLISECONDS_IN_SECOND,
    fps: COUNTER_ANIMATION_FPS,
    onRenderFrame(elapsedSeconds) {
      const remainingSeconds = COUNTER_SECONDS - elapsedSeconds;

      const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
      const seconds = remainingSeconds % SECONDS_IN_MINUTE;

      gameCounter.ariaLabel = [minutes, seconds].map(formatNumber).join(`:`);
    },
  });

  const onScreenChange = (evt) => {
    const {currentScreen} = evt.detail;
    if (currentScreen.id === ScreenId.GAME) {
      if (!counterAnimation.hasStarted()) {
        counterAnimation.start();
        storage.setState(counterAnimation.getStartTimestamp());
      }
    }
  };

  document.body.addEventListener(ScreenEventType.SCREEN_CHANGE, onScreenChange);

  const startTimestamp = storage.getState(0);
  if (startTimestamp > 0) {
    counterAnimation.start(startTimestamp);
  }
};
