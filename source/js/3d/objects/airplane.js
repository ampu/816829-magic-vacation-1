import {OBJLoader} from 'three/examples/jsm/loaders/objloader';
import {Material} from '3d/materials/materials';

const AIRPLANE = {
  url: `./3d/module-6/scene-0-objects/airplane.obj`,
};

export const addAirplane = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(AIRPLANE.url, resolve, null, reject);
  })
    .then((object) => {
      /** @param {THREE.Group} object */
      object.traverse((child) => {
        if (child.type === `Mesh`) {
          child.material = Material.BASIC_WHITE;
        }
      });
      object.scale.set(5, 5, 5);

      parent.add(object);
      return object;
    });
};
