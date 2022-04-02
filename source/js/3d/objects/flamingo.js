import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const FLAMINGO_SVG = {
  url: `./img/svg-forms/flamingo.svg`,
  height: 85,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 8,
    bevelSize: 1,
    bevelThickness: 1,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.SOFT_LIGHT_DOMINANT_RED,
};

const FLAMINGO = {
  position: [-427, 203, -150],
  rotation: [-15, 180, -20, `XYZ`],
};

export const addFlamingo = async (parent) => {
  const object = await loadSVGGroup(FLAMINGO_SVG);
  object.position.set(...FLAMINGO.position);
  rotateObjectInDegrees(object, FLAMINGO.rotation);

  parent.add(object);
  return object;
};
