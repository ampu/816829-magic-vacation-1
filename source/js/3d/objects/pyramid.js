import * as THREE from 'three';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const PYRAMID = {
  height: 280,
  radius: 250 / Math.sqrt(2),
  radiusSegments: 4,
  heightSegments: 1,
  position: [225, 140, 225],
  rotation: [0, 45, 0, `XYZ`],
};

export const addPyramid = (parent) => {
  const geometry = new THREE.ConeGeometry(PYRAMID.radius, PYRAMID.height, PYRAMID.radiusSegments, PYRAMID.heightSegments);

  const object = new THREE.Mesh(geometry, Material.SOFT_BLUE);
  object.position.set(...PYRAMID.position);
  rotateObjectInDegrees(object, PYRAMID.rotation);

  parent.add(object);
  return object;
};
