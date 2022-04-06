import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {ObjectName} from '3d/constants/object-name';

const COMPASS_STATIC_URL = `./3d/module-6/rooms-scenes/scenesStatic/scene3-static-output-1.gltf`;

const COMPASS_STATIC = {
  position: [0, 0, 0],
};

export const addCompassStatic = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(COMPASS_STATIC_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.STATIC;
      object.position.set(...COMPASS_STATIC.position);

      parent.add(object);
      return object;
    });
};
