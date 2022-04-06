import * as THREE from 'three';
import * as lil from 'lil-gui';

const NOOP = () => {
};

/**
 * @param {string?} title
 * @return {lil.GUI}
 */
export const getGUI = (title = undefined) => {
  if (!getGUI.instance) {
    getGUI.instance = new lil.GUI();
  }
  if (title) {
    getGUI.instance.title(title);
  }
  return getGUI.instance;
};

/**
 * @param {Object3D} object
 * @param {string} property
 * @return {[object,string,number,number,number]}
 */
const createRotationController = (object, property) => {
  const helper = {
    get [property]() {
      return Math.round(THREE.MathUtils.radToDeg(object[property]));
    },
    set [property](value) {
      object[property] = THREE.MathUtils.degToRad(value);
    },
  };
  return [helper, property, -180, 180, 1];
};

/**
 * @param {lil.GUI} gui
 * @param {Object3D} object
 * @param {function} onChange
 */
export const addRotationGUI = (gui, object, onChange = NOOP) => {
  const rotation = gui.addFolder(`rotation`);
  const controllers = [
    rotation.add(...createRotationController(object.rotation, `x`)),
    rotation.add(...createRotationController(object.rotation, `y`)),
    rotation.add(...createRotationController(object.rotation, `z`)),
  ];
  const onChangeWithUpdate = () => {
    onChange();
    for (const controller of controllers) {
      controller.updateDisplay();
    }
  };
  for (const controller of controllers) {
    controller.onChange(onChangeWithUpdate);
  }
  gui.add(object.rotation, `order`, [`XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY`, `ZYX`]);
};
