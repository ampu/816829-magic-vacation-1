import * as THREE from 'three';

import {squashTorusGeometry} from '3d/helpers/geometry-helpers';
import {Material} from '3d/materials/materials';

const CIRCLE_SEGMENTS = 32;
const LINE_SEGMENTS = 1;

const PENDANT_RADIUS = 1;
const PENDANT_HEIGHT = 1000;

const SMALL_PLANET_RADIUS = 10;
const BIG_PLANET_RADIUS = 60;
const RING_INNER_RADIUS = 80;
const RING_OUTER_RADIUS = 120;
const RING_ANGLE = 18;
const RING_HEIGHT = 2;

const addPendant = (parent) => {
  const geometry = new THREE.CylinderGeometry(PENDANT_RADIUS, PENDANT_RADIUS, PENDANT_HEIGHT, CIRCLE_SEGMENTS, LINE_SEGMENTS);

  const object = new THREE.Mesh(geometry, Material.SOFT_METAL_GREY);
  object.position.y = PENDANT_HEIGHT / 2;

  parent.add(object);
  return object;
};

const addSmallPlanet = (parent, material) => {
  const geometry = new THREE.SphereGeometry(SMALL_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const object = new THREE.Mesh(geometry, material);
  object.position.y = 100;

  parent.add(object);
  return object;
};

const addBigPlanet = (parent, material) => {
  const geometry = new THREE.SphereGeometry(BIG_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const object = new THREE.Mesh(geometry, material);

  parent.add(object);
  return object;
};

const addRing = (parent, material) => {
  const radius = (RING_OUTER_RADIUS + RING_INNER_RADIUS) / 2;
  const tube = (RING_OUTER_RADIUS - RING_INNER_RADIUS) / 2;
  const geometry = new THREE.TorusGeometry(radius, tube, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);
  squashTorusGeometry(geometry, RING_HEIGHT, true);

  const object = new THREE.Mesh(geometry, material);
  object.rotation.set(Math.PI / 2, 0, THREE.MathUtils.degToRad(RING_ANGLE), `ZXY`);

  parent.add(object);
  return object;
};

const addSaturn = (parent, position, redMaterial, purpleMaterial) => {
  const saturn = new THREE.Group();
  saturn.position.copy(position);

  addPendant(saturn);
  addSmallPlanet(saturn, purpleMaterial);
  const bigPlanet = addBigPlanet(saturn, redMaterial);
  addRing(bigPlanet, purpleMaterial);

  parent.add(saturn);
  return saturn;
};

export const addSaturn1 = (parent) => {
  return addSaturn(parent, {x: -200, y: 200, z: 0}, Material.SOFT_DOMINANT_RED, Material.SOFT_BRIGHT_PURPLE);
};

export const addSaturn4 = (parent) => {
  return addSaturn(parent, {x: 0, y: 200, z: -200}, Material.SOFT_SHADOWED_DOMINANT_RED, Material.SOFT_SHADOWED_BRIGHT_PURPLE);
};
