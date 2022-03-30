import * as THREE from 'three';
// eslint-disable-next-line no-unused-vars
import * as lil from 'lil-gui';

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
 */
export const addRotationGUI = (gui, object) => {
  const rotation = gui.addFolder(`rotation`);
  rotation.add(...createRotationController(object.rotation, `x`));
  rotation.add(...createRotationController(object.rotation, `y`));
  rotation.add(...createRotationController(object.rotation, `z`));
  gui.add(object.rotation, `order`, [`XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY`, `ZYX`]);
};
