import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const HISTORY_LEAF_SVG = {
  url: `./img/svg-forms/leaf.svg`,
  height: 335,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 3,
    bevelSize: 3,
    bevelThickness: 3,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.BASIC_GREEN,
};

const KEYHOLE_LEAF_SVG = {
  url: `./img/svg-forms/leaf.svg`,
  height: 128,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 1,
    bevelSize: 1,
    bevelThickness: 3,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.BASIC_GREEN,
};

const KEYHOLE_LEAF = {
  position: [436, 175, 0],
  rotation: [25, -60, -45, `XYZ`],
};

export const addLeaf1 = async (parent) => {
  const object = await loadSVGGroup(HISTORY_LEAF_SVG);
  object.position.set(0, 0, 650);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};

export const addKeyholeLeaf = async (parent) => {
  const object = await loadSVGGroup(KEYHOLE_LEAF_SVG);
  object.position.set(...KEYHOLE_LEAF.position);
  rotateObjectInDegrees(object, KEYHOLE_LEAF.rotation);

  parent.add(object);
  return object;
};
