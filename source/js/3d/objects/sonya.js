import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';

const SONYA_URL = `./3d/module-6/rooms-scenes/objects/sonya.gltf`;

const SONYA = {
  position: [400, 100, 300],
  rotation: [0, 10, 0, `XYZ`]
};

export const addSonya = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SONYA_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.SONYA;
      object.position.set(...SONYA.position);
      rotateObjectInDegrees(object, SONYA.rotation);

      parent.add(object);
      return object;
    });
};
