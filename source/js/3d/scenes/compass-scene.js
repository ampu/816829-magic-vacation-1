import * as THREE from 'three';
import {addSnowman} from '3d/objects/snowman';
import {addRoad} from '3d/objects/road';
import {addCompassWall} from '3d/objects/wall';
import {addCompassFloor} from '3d/objects/floor';
import {addCompassStatic} from '3d/objects/compass-static';

export const addCompassScene = (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  addSnowman(scene);
  addRoad(scene);
  addCompassWall(scene);
  addCompassFloor(scene);
  addCompassStatic(scene);

  parent.add(scene);
  return scene;
};
