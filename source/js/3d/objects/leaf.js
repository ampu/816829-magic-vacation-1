import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees, wrapObject} from '3d/helpers/object-helpers';
import {createRotationCalculator} from 'helpers/calculator';

const KEYHOLE_LEAF_SVG = {
  url: `./img/svg-forms/leaf.svg`,
  height: 128,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 1,
    bevelSize: 1,
    bevelThickness: 3,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.BASIC_GREEN,
};

const KEYHOLE_LEAF = {
  position: [436, 175, 0],
  rotation: [25, -60, -45, `XYZ`],
};

export const addKeyholeLeaf = async (parent) => {
  const object = await loadSVGGroup(KEYHOLE_LEAF_SVG);
  rotateObjectInDegrees(object, KEYHOLE_LEAF.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...KEYHOLE_LEAF.position);
  parent.add(wrapper);

  const getRotation = createRotationCalculator({yRange: [[0, -60, -15], [0, 0, 0]]});
  return {
    object: wrapper,
    onRenderFrame({progress}) {
      wrapper.rotation.set(...getRotation(progress));
    }
  };
};
