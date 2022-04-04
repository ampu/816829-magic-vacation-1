import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';
import {scaleObjectToFitHeight, rotateObjectInDegrees} from '3d/helpers/object-helpers';
import {wrapObject} from '3d/helpers/object-helpers';
import {createRotationCalculator} from 'helpers/calculator';

export const WATERMELON = {
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
      rotateObjectInDegrees(object, WATERMELON.rotation);

      const wrapper = wrapObject(object);
      wrapper.position.set(...WATERMELON.position);
      parent.add(wrapper);

      const getRotation = createRotationCalculator({yRange: [[-35, 15, 60], [0, 0, 0]]});
      return {
        object: wrapper,
        onRenderFrame({progress}) {
          wrapper.rotation.set(...getRotation(progress));
        },
      };
    });
};
