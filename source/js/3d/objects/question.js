import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const QUESTION_SVG = {
  url: `./img/svg-forms/question.svg`,
  height: 56,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 8,
    bevelSize: 1,
    bevelThickness: 1,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.BASIC_BLUE,
};

const QUESTION = {
  position: [109, -258, -100],
  rotation: [-45, 0, 20, `XYZ`],
};

export const addQuestion = async (parent) => {
  const object = await loadSVGGroup(QUESTION_SVG);
  object.position.set(...QUESTION.position);
  rotateObjectInDegrees(object, QUESTION.rotation);

  parent.add(object);
  return object;
};
