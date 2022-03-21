import {loadSVGGroup} from '3d/helpers/svg-helpers';

const BIG_LEAF = {
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
};

const SMALL_LEAF = {
  url: `./img/svg-forms/leaf.svg`,
  height: 108,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 3,
    bevelSize: 3,
    bevelThickness: 3,
    bevelOffset: 0,
  },
};

export const addBigLeaf = async (parent) => {
  const object = await loadSVGGroup(BIG_LEAF);
  object.position.set(0, 0, 550);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};

export const addSmallLeaf = async (parent) => {
  const object = await loadSVGGroup(SMALL_LEAF);
  object.position.set(0, 0, 550);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};
