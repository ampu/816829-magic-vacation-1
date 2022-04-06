import * as THREE from 'three';

import {ObjectName} from '3d/constants/object-name';
import {castShadow, receiveShadow} from '3d/helpers/object-helpers';

import {addPyramid} from '3d/objects/pyramid';
import {addHistorySuitcase} from '3d/objects/suitcase';
import {addLamppost} from '3d/objects/lamppost';
import {addPyramidWall} from '3d/objects/wall';
import {addPyramidFloor} from '3d/objects/floor';
import {addPyramidStatic} from '3d/objects/pyramid-static';
import {addPyramidBigLeaf, addPyramidSmallLeaf} from '3d/objects/leaf';

import {CompositeAnimation} from 'helpers/composite-animation';

export const addPyramidScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  const [
    bigLeaf,
    smallLeaf,
  ] = await Promise.all([
    addPyramidBigLeaf(scene),
    addPyramidSmallLeaf(scene),
    addPyramid(scene),
    addHistorySuitcase(scene, `Pyramid Suitcase`),
    addLamppost(scene),
    addPyramidWall(scene),
    addPyramidFloor(scene),
    addPyramidStatic(scene),
  ]);

  receiveShadow(scene, [
    ObjectName.FLOOR,
    ObjectName.WALL,
    ObjectName.STATIC,
  ]);

  castShadow(scene, [
    ObjectName.SUITCASE,
    ObjectName.STATIC,
    ObjectName.LAMPPOST,
    ObjectName.BIG_LEAF,
    ObjectName.SMALL_LEAF,
  ]);

  parent.add(scene);
  return {
    scene,
    animation: new CompositeAnimation([
      bigLeaf.animation,
      smallLeaf.animation,
    ]),
  };
};
