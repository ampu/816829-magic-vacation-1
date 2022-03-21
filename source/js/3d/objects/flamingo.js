import {loadSVGGroup} from '3d/helpers/svg-helpers';

const FLAMINGO = {
  url: `./img/svg-forms/flamingo.svg`,
  height: 85,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 8,
    bevelSize: 2,
    bevelThickness: 2,
    bevelOffset: 0,
  },
};

export const addFlamingo = async (parent) => {
  const object = await loadSVGGroup(FLAMINGO);
  object.position.set(0, 0, 200);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};
