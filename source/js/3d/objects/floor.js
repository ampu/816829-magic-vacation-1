import * as THREE from 'three';
import {Material} from '3d/materials/materials';

const FLOOR = {
  rotateX: Math.PI / 2,
  segments: 32,
  thetaStart: 0,
  thetaLength: Math.PI / 2,
};

const DOG_FLOOR = {
  radius: 2000,
  material: Material.SOFT_DARK_PURPLE,
};

const PYRAMID_FLOOR = {
  radius: 2000,
  material: Material.SOFT_BRIGHT_BLUE,
};

const COMPASS_FLOOR = {
  radius: 2000,
  material: Material.SOFT_MOUNTAIN_BLUE,
};

const SONYA_FLOOR = {
  radius: 2000,
  material: Material.SOFT_SHADOWED_DARK_PURPLE,
};

const addFloor = async (parent, {radius, material}) => {
  const geometry = new THREE.CircleGeometry(radius, FLOOR.segments, FLOOR.thetaStart, FLOOR.thetaLength);

  const object = new THREE.Mesh(geometry, material);
  object.rotateX(FLOOR.rotateX);

  parent.add(object);
  return object;
};

export const addDogFloor = (parent) => {
  return addFloor(parent, DOG_FLOOR);
};

export const addPyramidFloor = (parent) => {
  return addFloor(parent, PYRAMID_FLOOR);
};

export const addCompassFloor = (parent) => {
  return addFloor(parent, COMPASS_FLOOR);
};

export const addSonyaFloor = (parent) => {
  return addFloor(parent, SONYA_FLOOR);
};
