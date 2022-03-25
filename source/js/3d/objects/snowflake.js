import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';

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
  onGetMaterial: () => Material.BASIC_BLUE,
};

export const addSnowflake = async (parent) => {
  const object = await loadSVGGroup(SNOWFLAKE);
  object.position.set(250, 0, 350);
  object.rotateY(Math.PI / 4);

  parent.add(object);
  return object;
};
