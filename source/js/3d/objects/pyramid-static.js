import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const PYRAMID_STATIC_URL = `./3d/module-6/rooms-scenes/scenesStatic/scene2-static-output-1.gltf`;

export const addPyramidStatic = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(PYRAMID_STATIC_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;

      parent.add(object);
      return object;
    });
};
