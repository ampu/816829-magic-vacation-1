export const KeyboardKey = {
  TAB: 9,
  ESCAPE: 27,
  LEFT: 37,
  RIGHT: 39,
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
