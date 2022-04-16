export const KeyboardKey = {
  LEFT: 37,
  RIGHT: 39,
};

export const addKeyboardListener = (keyToCallback, element = document) => {
  const onElementKeyDown = (evt) => {
    const callback = keyToCallback[evt.keyCode];
    if (callback) {
      callback();
    }
  };
  element.addEventListener(`keydown`, onElementKeyDown);
  return onElementKeyDown;
};
