import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';
import {rotateObjectInDegrees, scaleObjectToFitHeight, setPolarPosition2} from '3d/helpers/object-helpers';
import {getGUI} from '3d/helpers/gui-helpers';
import {ObjectName} from '3d/constants/object-name';

const SUITCASE_URL = `./3d/module-6/scene-0-objects/suitcase.gltf`;

const KEYHOLE_SUITCASE = {
  height: 102,
  position: [-60, -125, 0],
  rotation: [20, -140, 15, `XYZ`]
};

const HISTORY_SUITCASE = {
  height: 220,
  polarRadius: 830,
  startAngle: 20,
};

const loadSuitcase = () => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SUITCASE_URL, resolve, null, reject);
  });
};

const addSuitcase = async (parent, {height}) => {
  const gltf = await loadSuitcase();

  /** @param {Group} object */
  const object = gltf.scene;
  object.name = ObjectName.SUITCASE;
  scaleObjectToFitHeight(object, height);

  parent.add(object);
  return object;
};

export const addKeyholeSuitcase = async (parent) => {
  const object = await addSuitcase(parent, KEYHOLE_SUITCASE);
  object.position.set(...KEYHOLE_SUITCASE.position);
  rotateObjectInDegrees(object, KEYHOLE_SUITCASE.rotation);
  return object;
};

export const addHistorySuitcase = async (parent, title) => {
  const object = await addSuitcase(parent, HISTORY_SUITCASE);
  setPolarPosition2(object, HISTORY_SUITCASE.polarRadius, HISTORY_SUITCASE.startAngle, `z`, `x`);

  const folder = getGUI().addFolder(title);
  folder.add({
    get angle() {
      return Math.round(THREE.MathUtils.radToDeg(object.rotation.y));
    },
    set angle(value) {
      setPolarPosition2(object, HISTORY_SUITCASE.polarRadius, value, `z`, `x`);
    },
  }, `angle`, -360, 360, 1);
  return object;
};
