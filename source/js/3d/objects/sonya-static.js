import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {ObjectName} from '3d/constants/object-name';

const SONYA_STATIC_URL = `./3d/module-6/rooms-scenes/scenesStatic/scene4-static-output-1.gltf`;

export const addSonyaStatic = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SONYA_STATIC_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.STATIC;

      parent.add(object);
      return object;
    });
};
