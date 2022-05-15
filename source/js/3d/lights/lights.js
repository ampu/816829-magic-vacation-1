import * as THREE from 'three';

import {addGroup, findRoot} from '3d/helpers/object-helpers';
import {RADIAN} from 'helpers/calculator';
import {Color} from '3d/materials/materials';
import {ObjectName} from '3d/constants/object-name';

/** @enum {object} */
const LightConfig = {
  DIRECTIONAL: {
    name: ObjectName.DIRECTIONAL_LIGHT,
    args: [`rgb(255, 255, 255)`, 0.84],
    position: [0, 0, 0],
    targetPosition: [0, -1000 * Math.tan(15 / RADIAN), 1000],
  },
  POINT1: {
    name: ObjectName.POINT_LIGHT1,
    args: [`rgb(246, 242, 255)`, 0.6, 975, 2],
    position: [-785, -350, 710],
  },
  POINT2: {
    name: ObjectName.POINT_LIGHT2,
    args: [`rgb(245, 254, 255)`, 0.95, 975, 2],
    position: [730, 800, 985],
  },
};

export const addCameraLights = (parent) => {
  const scene = findRoot(parent);
  const group = addGroup(parent);

  addDirectionalLight(scene, group, LightConfig.DIRECTIONAL);

  const pointLights = addGroup(group, ObjectName.POINT_LIGHTS);
  addPointLight(scene, pointLights, LightConfig.POINT1);
  addPointLight(scene, pointLights, LightConfig.POINT2);
  return group;
};

const addDirectionalLightTargetHelper = (parent, targetPosition) => {
  const geometry = new THREE.SphereGeometry(30);
  const material = new THREE.MeshStandardMaterial({
    color: Color.WHITE,
    transparent: true,
    opacity: 0.5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...targetPosition);

  parent.add(mesh);
  return mesh;
};

const addDirectionalLight = (scene, parent, {name, args, position, targetPosition}) => {
  const light = new THREE.DirectionalLight(...args);
  light.name = name;
  light.position.set(...position);
  light.target.position.set(...targetPosition);

  castLightShadow(light);

  // addDirectionalLightTargetHelper(parent, targetPosition);

  parent.add(light);
  parent.add(light.target);

  scene.add(new THREE.DirectionalLightHelper(light, 50));
  return light;
};

const addPointLight = (scene, parent, {name, args, position}) => {
  const light = new THREE.PointLight(...args);
  light.name = name;
  light.position.set(...position);

  castLightShadow(light);

  parent.add(light);

  scene.add(new THREE.PointLightHelper(light, 50));
  return light;
};

const castLightShadow = (light) => {
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
};
