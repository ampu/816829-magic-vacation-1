import * as THREE from 'three';
import {addSonyaCarpet} from '3d/objects/carpet';
import {addHistorySuitcase} from '3d/objects/suitcase';
import {addSonyaSaturn} from '3d/objects/saturn';
import {addSonyaWall} from '3d/objects/wall';
import {addSonyaFloor} from '3d/objects/floor';
import {addSonyaStatic} from '3d/objects/sonya-static';
import {addSonya} from '3d/objects/sonya';
import {castShadow, receiveShadow} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';

export const addSonyaScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  await Promise.all([
    addSonyaCarpet(scene),
    addHistorySuitcase(scene, `Sonya Suitcase`),
    addSonyaSaturn(scene),
    addSonyaWall(scene),
    addSonyaFloor(scene),
    addSonyaStatic(scene),
    addSonya(scene),
  ]);

  receiveShadow(scene, [
    ObjectName.FLOOR,
    ObjectName.WALL,
    ObjectName.STATIC,
    ObjectName.CARPET,
  ]);

  castShadow(scene, [
    ObjectName.STATIC,
    ObjectName.SONYA,
    ObjectName.SUITCASE,
  ]);

  parent.add(scene);
  return scene;
};
