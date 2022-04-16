import clamp from 'lodash/clamp';
import {addKeyboardListener, KeyboardKey} from 'helpers/keyboard-helpers';
import {addProgressController, getGUI} from '3d/helpers/gui-helpers';

export const createProgressHelper = (gui = getGUI(), startProgress = 1) => {
  let progress = startProgress;

  const doGetProgress = () => {
    return progress;
  };

  const doSetProgress = (value) => {
    progress = value;
  };

  const adjustProgress = (value) => {
    progress = clamp(progress + value, 0, 1);
    progressController.updateDisplay();
  };

  const progressController = addProgressController(gui, doGetProgress, doSetProgress);

  addKeyboardListener({
    [KeyboardKey.LEFT]: () => adjustProgress(-0.1),
    [KeyboardKey.RIGHT]: () => adjustProgress(+0.1),
  });

  return {
    getProgress: doGetProgress,
  };
};

export default createProgressHelper();
