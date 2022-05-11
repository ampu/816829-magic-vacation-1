import * as THREE from 'three';
import {addSonyaCarpet} from '3d/objects/carpet';
import {addSonyaSaturn} from '3d/objects/saturn';
import {addSonyaWall} from '3d/objects/wall';
import {addSonyaFloor} from '3d/objects/floor';
import {addSonyaStatic} from '3d/objects/sonya-static';
import {addSonya} from '3d/objects/sonya';
import {castShadow, receiveShadow} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';
import {CompositeAnimation} from 'helpers/composite-animation';

export const addSonyaScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  const [
    sonya,
  ] = await Promise.all([
    addSonya(scene),
    addSonyaCarpet(scene),
    addSonyaSaturn(scene),
    addSonyaWall(scene),
    addSonyaFloor(scene),
    addSonyaStatic(scene),
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
  ]);

  parent.add(scene);
  return {
    scene,
    animation: new CompositeAnimation([
      sonya.animation,
    ]),
  };
};
