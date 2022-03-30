import * as THREE from 'three';

import {addKeyhole} from '3d/objects/keyhole';
import {addFlamingo} from '3d/objects/flamingo';
import {addSnowflake} from '3d/objects/snowflake';
import {addWatermelon} from '3d/objects/watermelon';
import {addSuitcase} from '3d/objects/suitcase';
import {addAirplane} from '3d/objects/airplane';
import {addQuestion} from '3d/objects/question';
import {addKeyholeSaturn} from '3d/objects/saturn';
import {addKeyholeLeaf} from '3d/objects/leaf';

export const addKeyholeScene = async (parent) => {
  const scene = new THREE.Group();

  addKeyhole(scene);
  addFlamingo(scene);
  addSnowflake(scene);
  addWatermelon(scene);
  addSuitcase(scene);
  addAirplane(scene);
  addQuestion(scene);
  addKeyholeSaturn(scene);
  addKeyholeLeaf(scene);

  parent.add(scene);
  return scene;
};
