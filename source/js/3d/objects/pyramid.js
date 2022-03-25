import * as THREE from 'three';
import {Material} from '3d/materials/materials';

const RADIUS = 250 / Math.sqrt(2);
const HEIGHT = 280;
const RADIUS_SEGMENTS = 4;
const HEIGHT_SEGMENTS = 1;

export const addPyramid = (parent) => {
  const geometry = new THREE.ConeGeometry(RADIUS, HEIGHT, RADIUS_SEGMENTS, HEIGHT_SEGMENTS);

  const object = new THREE.Mesh(geometry, Material.SOFT_BLUE);
  object.position.set(0, HEIGHT / 2, 250);

  parent.add(object);
  return object;
};
