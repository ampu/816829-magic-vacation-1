import * as THREE from 'three';

import {rotateObjectInDegrees, scaleObjectToFitHeight, squashTorusGeometry} from '3d/helpers/geometry-helpers';
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

const HISTORY_SATURN = {
  position: [0, 0, 0],
};

const KEYHOLE_SATURN = {
  height: 65,
  position: [335, -111, 100],
  rotation: [20, -25, 10, `XYZ`],
};

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

const addSaturn = (parent, shouldRenderPendant, redMaterial, purpleMaterial) => {
  const saturn = new THREE.Group();

  if (shouldRenderPendant) {
    addPendant(saturn);
    addSmallPlanet(saturn, purpleMaterial);
  }
  const bigPlanet = addBigPlanet(saturn, redMaterial);
  addRing(bigPlanet, purpleMaterial);

  parent.add(saturn);
  return saturn;
};

export const addHistorySaturn = (parent) => {
  const object = addSaturn(parent, true, Material.SOFT_DOMINANT_RED, Material.SOFT_BRIGHT_PURPLE);
  object.position.set(...HISTORY_SATURN.position);
  return object;
};

export const addKeyholeSaturn = (parent) => {
  const object = addSaturn(parent, false, Material.SOFT_SHADOWED_DOMINANT_RED, Material.SOFT_SHADOWED_BRIGHT_PURPLE);
  scaleObjectToFitHeight(object, KEYHOLE_SATURN.height);
  object.position.set(...KEYHOLE_SATURN.position);
  rotateObjectInDegrees(object, KEYHOLE_SATURN.rotation);
  return object;
};
