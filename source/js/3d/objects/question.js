import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees, wrapObject} from '3d/helpers/object-helpers';
import {createRotationCalculator} from 'helpers/calculator';

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

export const QUESTION = {
  position: [109, -258, -100],
  rotation: [-45, 0, 20, `XYZ`],
};

export const addQuestion = async (parent) => {
  const object = await loadSVGGroup(QUESTION_SVG);
  rotateObjectInDegrees(object, QUESTION.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...QUESTION.position);
  parent.add(wrapper);

  const getRotation = createRotationCalculator({yRange: [[0, 0, -50], [0, 0, 0]]});
  return {
    object: wrapper,
    onRenderFrame({progress}) {
      wrapper.rotation.set(...getRotation(progress));
    },
  };
};
