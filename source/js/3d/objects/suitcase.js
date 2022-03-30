import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';
import {rotateObjectInDegrees, scaleObjectToFitHeight} from '3d/helpers/geometry-helpers';

const SUITCASE = {
  url: `./3d/module-6/scene-0-objects/suitcase.gltf`,
  height: 102,
  position: [-60, -125, 0],
  rotation: [20, -140, 15, `XYZ`]
};

export const addSuitcase = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SUITCASE.url, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      scaleObjectToFitHeight(object, SUITCASE.height);
      object.position.set(...SUITCASE.position);
      rotateObjectInDegrees(object, SUITCASE.rotation);

      parent.add(object);
      return object;
    });
};
