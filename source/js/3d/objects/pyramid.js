import * as THREE from 'three';

const RADIUS = 250 / Math.sqrt(2);
const HEIGHT = 280;
const RADIUS_SEGMENTS = 4;
const HEIGHT_SEGMENTS = 1;
const COLOR = 0x2064cd;

export const addPyramid = (parent) => {
  const geometry = new THREE.ConeGeometry(RADIUS, HEIGHT, RADIUS_SEGMENTS, HEIGHT_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: COLOR,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, HEIGHT / 2, 250);

  parent.add(object);
  return object;
};
