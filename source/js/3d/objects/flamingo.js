import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';

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
  onGetMaterial: () => Material.SOFT_LIGHT_DOMINANT_RED,
};

export const addFlamingo = async (parent) => {
  const object = await loadSVGGroup(FLAMINGO);
  object.position.set(250, 0, 250);
  object.rotateY(Math.PI / 4);

  parent.add(object);
  return object;
};
