import * as THREE from 'three';
import {addSonyaCarpet} from '3d/objects/carpet';
import {addDogSuitcase} from '3d/objects/suitcase';
import {addSonyaSaturn} from '3d/objects/saturn';
import {addSonyaWall} from '3d/objects/wall';
import {addSonyaFloor} from '3d/objects/floor';
import {addSonyaStatic} from '3d/objects/sonya-static';

export const addSonyaScene = (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  addSonyaCarpet(scene);
  addDogSuitcase(scene);
  addSonyaSaturn(scene);
  addSonyaWall(scene);
  addSonyaFloor(scene);
  addSonyaStatic(scene);

  parent.add(scene);
  return scene;
};
