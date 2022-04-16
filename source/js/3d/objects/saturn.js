import * as THREE from 'three';

import {Material} from '3d/materials/materials';
import {squashTorusGeometry} from '3d/helpers/geometry-helpers';
import {rotateObjectInDegrees, scaleObjectToFitHeight, wrapObject} from '3d/helpers/object-helpers';

import {createRotationCalculator, createSineCalculator} from 'helpers/calculator';
import {FrameAnimation} from 'helpers/frame-animation';

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

const DOG_SATURN = {
  position: [365, 515 + PENDANT_HEIGHT, 200],
  rotation: [-2, 90, 0, `XYZ`],
  rotationIterationDuration: 3600,
};

const SONYA_SATURN = {
  position: [200, 450 + PENDANT_HEIGHT, 200],
  rotation: [-2, 90, 0, `XYZ`],
};

const KEYHOLE_SATURN = {
  height: 65,
  position: [335, -111 + PENDANT_HEIGHT / 2, 100],
  rotation: [20, -25, 10, `XYZ`],
};

const addPendant = (parent) => {
  const geometry = new THREE.CylinderGeometry(PENDANT_RADIUS, PENDANT_RADIUS, PENDANT_HEIGHT, CIRCLE_SEGMENTS, LINE_SEGMENTS);

  const object = new THREE.Mesh(geometry, Material.SOFT_METAL_GREY);
  object.position.y = -PENDANT_HEIGHT / 2;

  parent.add(object);
  return object;
};

const addSmallPlanet = (parent, material) => {
  const geometry = new THREE.SphereGeometry(SMALL_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const object = new THREE.Mesh(geometry, material);
  object.position.y = 100 - PENDANT_HEIGHT;

  parent.add(object);
  return object;
};

const addBigPlanet = (parent, material) => {
  const geometry = new THREE.SphereGeometry(BIG_PLANET_RADIUS, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const object = new THREE.Mesh(geometry, material);
  object.position.y = -PENDANT_HEIGHT;

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

const loadSaturn = (shouldRenderPendant, redMaterial, purpleMaterial) => {
  const saturn = new THREE.Group();

  if (shouldRenderPendant) {
    addPendant(saturn);
    addSmallPlanet(saturn, purpleMaterial);
  }
  const bigPlanet = addBigPlanet(saturn, redMaterial);
  addRing(bigPlanet, purpleMaterial);

  return {
    saturn,
    bigPlanet,
  };
};

export const addDogSaturn = (parent) => {
  const {saturn, bigPlanet} = loadSaturn(true, Material.SOFT_DOMINANT_RED, Material.SOFT_BRIGHT_PURPLE);
  rotateObjectInDegrees(saturn, SONYA_SATURN.rotation);

  const saturnWrapper = wrapObject(saturn);
  saturnWrapper.position.set(...DOG_SATURN.position);

  const rotationCalculator = createSineCalculator({period: DOG_SATURN.rotationIterationDuration});

  parent.add(saturnWrapper);
  return {
    object: saturnWrapper,
    animation: new FrameAnimation({
      delay: 2200,
      duration: Infinity,
      onRenderFrame({elapsed}) {
        saturnWrapper.rotation.x = saturnWrapper.rotation.z = -THREE.MathUtils.degToRad(rotationCalculator.calculateY(elapsed));

        bigPlanet.rotation.z = THREE.MathUtils.degToRad(2 * rotationCalculator.calculateY(elapsed + DOG_SATURN.rotationIterationDuration / 2));
        bigPlanet.rotation.x = -bigPlanet.rotation.z;
      },
    })
  };
};

export const addSonyaSaturn = (parent) => {
  const {saturn: object} = loadSaturn(false, Material.SOFT_SHADOWED_DOMINANT_RED, Material.SOFT_SHADOWED_BRIGHT_PURPLE);
  object.position.set(...SONYA_SATURN.position);
  rotateObjectInDegrees(object, SONYA_SATURN.rotation);

  parent.add(object);
  return object;
};

export const addKeyholeSaturn = (parent) => {
  const {saturn: object} = loadSaturn(false, Material.SOFT_DOMINANT_RED, Material.SOFT_SHADOWED_BRIGHT_PURPLE);
  scaleObjectToFitHeight(object, KEYHOLE_SATURN.height);
  rotateObjectInDegrees(object, KEYHOLE_SATURN.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...KEYHOLE_SATURN.position);
  parent.add(wrapper);

  const getRotation = createRotationCalculator({yRange: [[0, -30, -110], [0, 0, 0]]});
  return {
    object: wrapper,
    onRenderFrame({progress}) {
      wrapper.rotation.set(...getRotation(progress));
    },
  };
};
