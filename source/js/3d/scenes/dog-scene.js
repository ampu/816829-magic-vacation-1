import * as THREE from 'three';
import {addDogSuitcase} from '3d/objects/suitcase';
import {addDogCarpet} from '3d/objects/carpet';
import {addDogSaturn} from '3d/objects/saturn';
import {addDogWall} from '3d/objects/wall';
import {addDogFloor} from '3d/objects/floor';
import {addDogStatic} from '3d/objects/dog-static';

export const addDogScene = (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  addDogSuitcase(scene);
  addDogCarpet(scene);
  addDogSaturn(scene);
  addDogWall(scene);
  addDogFloor(scene);
  addDogStatic(scene);

  parent.add(scene);
  return scene;
};
