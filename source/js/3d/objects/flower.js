import {loadSVGGroup} from '3d/helpers/svg-helpers';

const FLOWER = {
  url: `./img/svg-forms/flower.svg`,
  height: 413,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 4,
    bevelSize: 2,
    bevelThickness: 2,
    bevelOffset: 0,
  },
};

export const addFlower = async (parent) => {
  const object = await loadSVGGroup(FLOWER);
  object.position.set(0, 0, 900);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};
