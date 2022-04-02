import {OBJLoader} from 'three/examples/jsm/loaders/objloader';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees, scaleObjectToFitHeight} from '3d/helpers/object-helpers';

const AIRPLANE = {
  url: `./3d/module-6/scene-0-objects/airplane.obj`,
  height: 45,
  position: [190, 74, -300],
  rotation: [-110, 45, 150, `XYZ`]
};

export const addAirplane = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(AIRPLANE.url, resolve, null, reject);
  })
    .then((object) => {
      /** @param {Group} object */
      object.traverse((child) => {
        if (child.type === `Mesh`) {
          child.material = Material.BASIC_WHITE;
        }
      });
      scaleObjectToFitHeight(object, AIRPLANE.height);
      object.position.set(...AIRPLANE.position);
      rotateObjectInDegrees(object, AIRPLANE.rotation);

      parent.add(object);
      return object;
    });
};
