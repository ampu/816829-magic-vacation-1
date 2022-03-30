import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';

const WATERMELON = {
  url: `./3d/module-6/scene-0-objects/watermelon.gltf`,
};

export const addWatermelon = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(WATERMELON.url, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {THREE.Group} object */
      const object = gltf.scene;
      object.position.set(800, 0, 0);
      object.scale.set(5, 5, 5);

      parent.add(object);
      return object;
    });
};
