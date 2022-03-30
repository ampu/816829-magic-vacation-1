import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';

const SUITCASE = {
  url: `./3d/module-6/scene-0-objects/suitcase.gltf`,
};

export const addSuitcase = async (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SUITCASE.url, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {THREE.Group} object */
      const object = gltf.scene;
      object.position.set(0, 0, 800);

      parent.add(object);
      return object;
    });
};
