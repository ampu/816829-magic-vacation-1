import {loadSVGGroup} from '3d/helpers/svg-helpers';

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
};

export const addQuestion = async (parent) => {
  const object = await loadSVGGroup(QUESTION);
  object.position.set(0, 0, 100);
  object.rotateY(Math.PI / 2);

  parent.add(object);
  return object;
};
