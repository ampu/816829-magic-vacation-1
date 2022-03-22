import * as THREE from 'three';

import {squashTorusGeometry} from '3d/helpers/geometry-helpers';

const CIRCLE_SEGMENTS = 32;
const LINE_SEGMENTS = 1;

const PENDANT_RADIUS = 1;
const PENDANT_HEIGHT = 1000;
const PENDANT_COLOR = 0x7c8ea8;

const SMALL_PLANET_RADIUS = 10;
const SMALL_PLANET_COLOR = 0x804ee6;

const BIG_PLANET_RADIUS = 60;
const BIG_PLANET_COLOR = 0xfc0f3f;

const RING_INNER_RADIUS = 80;
const RING_OUTER_RADIUS = 120;
const RING_COLOR = 0x7f4ee6;
const RING_ANGLE = 18;
const RING_HEIGHT = 2;

const addPendant = (parent) => {
  const geometry = new THREE.CylinderGeometry(PENDANT_RADIUS, PENDANT_RADIUS, PENDANT_HEIGHT, CIRCLE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: PENDANT_COLOR,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.y = PENDANT_HEIGHT / 2;

  parent.add(object);
  return object;
};

const addSmallPlanet = (parent) => {
  const geometry = new THREE.SphereGeometry(SMALL_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: SMALL_PLANET_COLOR,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.y = 100;

  parent.add(object);
  return object;
};

const addBigPlanet = (parent) => {
  const geometry = new THREE.SphereGeometry(BIG_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: BIG_PLANET_COLOR,
  });

  const object = new THREE.Mesh(geometry, material);

  parent.add(object);
  return object;
};

const addRing = (parent) => {
  const radius = (RING_OUTER_RADIUS + RING_INNER_RADIUS) / 2;
  const tube = (RING_OUTER_RADIUS - RING_INNER_RADIUS) / 2;
  const geometry = new THREE.TorusGeometry(radius, tube, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);
  squashTorusGeometry(geometry, RING_HEIGHT, true);

  const material = new THREE.MeshStandardMaterial({
    color: RING_COLOR,
    side: THREE.DoubleSide,
  });

  const object = new THREE.Mesh(geometry, material);
  object.rotation.set(Math.PI / 2, 0, THREE.MathUtils.degToRad(RING_ANGLE), `ZXY`);

  parent.add(object);
  return object;
};

export const addSaturn = (parent) => {
  const saturn = new THREE.Group();
  saturn.position.y = 100;

  addPendant(saturn);
  addSmallPlanet(saturn);
  const bigPlanet = addBigPlanet(saturn);
  addRing(bigPlanet);

  parent.add(saturn);
  return saturn;
};
