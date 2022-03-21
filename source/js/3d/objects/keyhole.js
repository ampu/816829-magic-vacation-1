import {loadSVGGroup} from '3d/helpers/svg-helpers';

const KEYHOLE = {
  url: `./img/svg-forms/keyhole.svg`,
  height: 2000,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 20,
    bevelSize: 2,
    bevelThickness: 2,
    bevelOffset: 0,
  },
};

export const addKeyhole = async (parent) => {
  const object = await loadSVGGroup(KEYHOLE);

  parent.add(object);
  return object;
};
