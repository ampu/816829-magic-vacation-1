import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {ObjectName} from '3d/constants/object-name';

const COMPASS_URL = `./3d/module-6/rooms-scenes/objects/compass.gltf`;

export const addCompass = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(COMPASS_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.COMPASS;

      parent.add(object);
      return object;
    });
};
