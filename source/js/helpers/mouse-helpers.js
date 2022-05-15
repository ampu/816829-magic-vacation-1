export const MouseButton = {
  PRIMARY: 0,
};

const buttonToDown = {};

export const isMouseDown = (button = MouseButton.PRIMARY) => buttonToDown[button];

document.addEventListener(`mousedown`, (evt) => {
  buttonToDown[evt.button] = true;
});

document.addEventListener(`mouseup`, (evt) => {
  buttonToDown[evt.button] = false;
});
