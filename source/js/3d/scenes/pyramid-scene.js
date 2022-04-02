import * as THREE from 'three';
import {addPyramid} from '3d/objects/pyramid';
import {addHistorySuitcase} from '3d/objects/suitcase';
import {addLamppost} from '3d/objects/lamppost';
import {addPyramidWall} from '3d/objects/wall';
import {addPyramidFloor} from '3d/objects/floor';
import {addPyramidStatic} from '3d/objects/pyramid-static';
import {castShadow, receiveShadow} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';

export const addPyramidScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  await Promise.all([
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
  ]);

  parent.add(scene);
  return scene;
};
