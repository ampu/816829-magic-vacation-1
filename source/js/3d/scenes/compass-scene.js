import * as THREE from 'three';

import {ObjectName} from '3d/constants/object-name';
import {castShadow, receiveShadow} from '3d/helpers/object-helpers';

import {addSnowman} from '3d/objects/snowman';
import {addRoad} from '3d/objects/road';
import {addCompassWall} from '3d/objects/wall';
import {addCompassFloor} from '3d/objects/floor';
import {addCompassStatic} from '3d/objects/compass-static';
import {addCompass} from '3d/objects/compass';
import {addCompassPillars} from '3d/objects/pillar';

export const addCompassScene = async (parent, yRotation) => {
  const scene = new THREE.Group();
  scene.rotateY(yRotation);

  await Promise.all([
    addSnowman(scene),
    addRoad(scene),
    addCompassWall(scene),
    addCompassFloor(scene),
    addCompassStatic(scene),
    addCompass(scene),
    addCompassPillars(scene),
  ]);

  receiveShadow(scene, [
    ObjectName.FLOOR,
    ObjectName.WALL,
    ObjectName.STATIC,
  ]);

  castShadow(scene, [
    ObjectName.STATIC,
    ObjectName.SNOWMAN,
    ObjectName.COMPASS,
    ObjectName.PILLARS,
  ]);

  parent.add(scene);
  return scene;
};
