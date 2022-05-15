export const KeyboardKey = {
  TAB: 9,
  ESCAPE: 27,
  LEFT: 37,
  RIGHT: 39,
  A: 65,
  F: 70,
  L: 76,
  P: 80,
  T: 84,
};

export const addKeyboardListener = (keyToCallback, element = document) => {
  const onElementKeyDown = (evt) => {
    const callback = keyToCallback[evt.keyCode];
    if (callback) {
      callback(evt);
    }
  };
  element.addEventListener(`keydown`, onElementKeyDown);
  return () => element.removeEventListener(`keydown`, onElementKeyDown);
};
