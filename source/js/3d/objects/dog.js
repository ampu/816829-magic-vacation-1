import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';

const DOG_URL = `./3d/module-6/rooms-scenes/objects/dog.gltf`;

const DOG = {
  position: [500, 0, 440],
  rotation: [0, 60, 0, `XYZ`],
};

export const addDog = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(DOG_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.DOG;
      object.position.set(...DOG.position);
      rotateObjectInDegrees(object, DOG.rotation);

      parent.add(object);
      return object;
    });
};
