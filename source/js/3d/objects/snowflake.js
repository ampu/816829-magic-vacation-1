import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees, wrapObject} from '3d/helpers/object-helpers';
import {createRotationCalculator} from 'helpers/calculator';

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
  /** @param {Group} object */
  const object = await loadSVGGroup(SNOWFLAKE_SVG);
  rotateObjectInDegrees(object, SNOWFLAKE.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...SNOWFLAKE.position);
  parent.add(wrapper);

  const getRotation = createRotationCalculator({yRange: [[0, -75, 30], [0, 0, 0]]});
  return {
    object: wrapper,
    onRenderFrame({progress}) {
      wrapper.rotation.set(...getRotation(progress));
    },
  };
};
