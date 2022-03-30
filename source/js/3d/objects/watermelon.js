import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';
import {scaleObjectToFitHeight, rotateObjectInDegrees} from '3d/helpers/geometry-helpers';

const WATERMELON = {
  url: `./3d/module-6/scene-0-objects/watermelon.gltf`,
  height: 77,
  position: [-450, -200, 100],
  rotation: [10, -5, 140, `XYZ`],
};

export const addWatermelon = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(WATERMELON.url, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      scaleObjectToFitHeight(object, WATERMELON.height);
      object.position.set(...WATERMELON.position);
      rotateObjectInDegrees(object, WATERMELON.rotation);

      parent.add(object);
      return object;
    });
};
