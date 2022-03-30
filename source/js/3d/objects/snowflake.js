import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees} from '3d/helpers/geometry-helpers';

const SNOWFLAKE_SVG = {
  url: `./img/svg-forms/snowflake.svg`,
  height: 74,
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

const SNOWFLAKE = {
  position: [-285, 21, -100],
  rotation: [-15, 30, 15, `XYZ`],
};

export const addSnowflake = async (parent) => {
  const object = await loadSVGGroup(SNOWFLAKE_SVG);
  object.position.set(...SNOWFLAKE.position);
  rotateObjectInDegrees(object, SNOWFLAKE.rotation);

  parent.add(object);
  return object;
};
