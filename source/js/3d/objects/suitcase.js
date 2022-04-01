import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';
import {rotateObjectInDegrees, scaleObjectToFitHeight} from '3d/helpers/geometry-helpers';

const SUITCASE_URL = `./3d/module-6/scene-0-objects/suitcase.gltf`;

const KEYHOLE_SUITCASE = {
  height: 102,
  position: [-60, -125, 0],
  rotation: [20, -140, 15, `XYZ`]
};

const DOG_SUITCASE = {
  height: 220,
  position: [315, 0, 800],
  rotation: [0, 20, 0, `XYZ`]
};

const loadSuitcase = () => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SUITCASE_URL, resolve, null, reject);
  });
};

const addSuitcase = async (parent, {height, position, rotation}) => {
  const gltf = await loadSuitcase();

  /** @param {Group} object */
  const object = gltf.scene;
  scaleObjectToFitHeight(object, height);
  object.position.set(...position);
  rotateObjectInDegrees(object, rotation);

  parent.add(object);
  return object;
};

export const addKeyholeSuitcase = async (parent) => {
  return addSuitcase(parent, KEYHOLE_SUITCASE);
};

export const addDogSuitcase = async (parent) => {
  return addSuitcase(parent, DOG_SUITCASE);
};
