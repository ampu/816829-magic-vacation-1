import * as THREE from 'three';
import {addPyramid} from '3d/objects/pyramid';
import {addDogSuitcase} from '3d/objects/suitcase';
import {addLamppost} from '3d/objects/lamppost';
import {addPyramidWall} from '3d/objects/wall';
import {addPyramidFloor} from '3d/objects/floor';
import {addPyramidStatic} from '3d/objects/pyramid-static';

export const addPyramidScene = (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  addPyramid(scene);
  addDogSuitcase(scene);
  addLamppost(scene);
  addPyramidWall(scene);
  addPyramidFloor(scene);
  addPyramidStatic(scene);

  parent.add(scene);
  return scene;
};
