import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';

const QUESTION = {
  url: `./img/svg-forms/question.svg`,
  height: 56,
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

export const addQuestion = async (parent) => {
  const object = await loadSVGGroup(QUESTION);
  object.position.set(350, 0, 250);
  object.rotateY(Math.PI / 4);

  parent.add(object);
  return object;
};
