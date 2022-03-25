import * as THREE from 'three';
import {Material} from '3d/materials/materials';

const SEGMENTS = 32;

const Sphere = {
  BIG: {
    radius: 75,
    y: 65,
  },
  SMALL: {
    radius: 44,
    y: 173,
  },
};

const NOSE = {
  branch: 75,
  radius: 18,
  offset: 32,
  zRotation: -90,
  heightSegments: 1,
};

const addSphere = (parent, {radius, y}) => {
  const geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);

  const object = new THREE.Mesh(geometry, Material.STRONG_SNOW);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addNose = (parent) => {
  const height = Math.sqrt(NOSE.branch ** 2 - NOSE.radius ** 2);
  const x = Sphere.SMALL.radius + NOSE.offset - height + height / 2;
  const y = Sphere.SMALL.y;

  const geometry = new THREE.ConeGeometry(NOSE.radius, height, SEGMENTS, NOSE.heightSegments);

  const object = new THREE.Mesh(geometry, Material.SOFT_ORANGE);
  object.position.set(x, y, 0);
  object.rotation.set(0, 0, THREE.MathUtils.degToRad(NOSE.zRotation));

  parent.add(object);
  return object;
};

export const addSnowman = (parent) => {
  const snowman = new THREE.Group();
  snowman.position.x = 150;

  addNose(snowman);
  addSphere(snowman, Sphere.SMALL);
  addSphere(snowman, Sphere.BIG);

  parent.add(snowman);
  return snowman;
};
