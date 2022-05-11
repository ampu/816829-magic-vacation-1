import * as THREE from 'three';
import {addDogCarpet} from '3d/objects/carpet';
import {addDogSaturn} from '3d/objects/saturn';
import {addDogWall} from '3d/objects/wall';
import {addDogFloor} from '3d/objects/floor';
import {addDogStatic} from '3d/objects/dog-static';
import {addDog} from '3d/objects/dog';

import {castShadow, receiveShadow} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';
import {CompositeAnimation} from 'helpers/composite-animation';

export const addDogScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  const [
    // suitcase,
    dog,
    saturn,
  ] = await Promise.all([
    addDog(scene),
    addDogSaturn(scene),
    addDogCarpet(scene),
    addDogWall(scene),
    addDogFloor(scene),
    addDogStatic(scene),
  ]);

  receiveShadow(scene, [
    ObjectName.FLOOR,
    ObjectName.WALL,
    ObjectName.CARPET,
  ]);

  castShadow(scene, [
    // ObjectName.SUITCASE,
    ObjectName.STATIC,
    ObjectName.DOG,
  ]);

  parent.add(scene);
  return {
    scene,
    animation: new CompositeAnimation([
      // suitcase.animation,
      dog.animation,
      saturn.animation,
    ]),
  };
};
