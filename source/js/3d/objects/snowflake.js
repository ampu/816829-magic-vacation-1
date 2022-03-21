import {loadSVGGroup} from '3d/helpers/svg-helpers';

const SNOWFLAKE = {
  url: `./img/svg-forms/snowflake.svg`,
  // height: 74,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 8,
    bevelSize: 2,
    bevelThickness: 2,
    bevelOffset: 0,
  },
};

export const addSnowflake = async (parent) => {
  const object = await loadSVGGroup(SNOWFLAKE);
  object.position.set(0, 0, 300);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};
