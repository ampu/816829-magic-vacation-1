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
 * @return {lil.GUI}
 */
export const addRotationGUI = (gui, object, onChange = NOOP) => {
  const folder = gui.addFolder(`rotation`);
  const controllers = [
    folder.add(...createRotationController(object.rotation, `x`)),
    folder.add(...createRotationController(object.rotation, `y`)),
    folder.add(...createRotationController(object.rotation, `z`)),
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
  folder.add(object.rotation, `order`, [`XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY`, `ZYX`]);
  return folder;
};

/**
 * @param {lil.GUI} gui
 * @param {function} onGet
 * @param {function} onSet
 * @param {function} onChange
 * @return {lil.Controller}
 */
export const addProgressController = (gui, onGet, onSet, onChange = NOOP) => {
  const controller = gui.add({
    get progress() {
      return Number(onGet().toFixed(1));
    },
    set progress(value) {
      onSet(value);
    },
  }, `progress`, 0, 1);

  const onChangeWithUpdate = () => {
    onChange();
    controller.updateDisplay();
  };

  controller.onChange(onChangeWithUpdate);

  return controller;
};
