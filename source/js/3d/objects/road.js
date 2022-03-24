import * as THREE from 'three';

const LATHE_SEGMENTS = 32;

const HEIGHT = 3;
const WIDTH = 160;
const INNER_RADIUS = 732;
const PHI_START = 0;
const PHI_END = 90;
const ASPHALT_COLOR = 0x656c7c;

const STRIPE_COUNT = 4;
const STRIPE_PHI_LENGTH = 8;
const STRIPE_PHI_OFFSET_RATIO = 1 / 5;
const STRIPE_COLOR = 0xe8ecf4;

const addAsphalt = (parent) => {
  const points = [
    new THREE.Vector2(INNER_RADIUS, 0),
    new THREE.Vector2(INNER_RADIUS + WIDTH, 0),
    new THREE.Vector2(INNER_RADIUS + WIDTH, HEIGHT),
    new THREE.Vector2(INNER_RADIUS, HEIGHT),
    new THREE.Vector2(INNER_RADIUS, 0),
  ];
  const geometry = new THREE.LatheGeometry(points, LATHE_SEGMENTS, THREE.MathUtils.degToRad(PHI_START), THREE.MathUtils.degToRad(PHI_END - PHI_START));

  const material = new THREE.MeshStandardMaterial({
    color: ASPHALT_COLOR,
    side: THREE.DoubleSide,
  });

  const object = new THREE.Mesh(geometry, material);

  parent.add(object);
  return object;
};

const addStripe = (parent, stripeIndex) => {
  const points = [
    new THREE.Vector2(INNER_RADIUS + WIDTH * 3 / 7, HEIGHT),
    new THREE.Vector2(INNER_RADIUS + WIDTH * 4 / 7, HEIGHT),
  ];
  const phiLength = (PHI_END - PHI_START) / STRIPE_COUNT;
  const phiStart = PHI_START + stripeIndex * phiLength + phiLength * STRIPE_PHI_OFFSET_RATIO;

  const geometry = new THREE.LatheGeometry(points, LATHE_SEGMENTS, THREE.MathUtils.degToRad(phiStart), THREE.MathUtils.degToRad(STRIPE_PHI_LENGTH));

  const material = new THREE.MeshStandardMaterial({
    color: STRIPE_COLOR,
    side: THREE.BackSide,
  });

  const object = new THREE.Mesh(geometry, material);
  object.renderOrder = 1;
  object.onBeforeRender = (renderer) => {
    renderer.clearDepth();
  };

  parent.add(object);
  return object;
};

export const addRoad = (parent) => {
  const road = new THREE.Group();
  road.position.y = 20;

  addAsphalt(road);
  for (let i = 0; i < STRIPE_COUNT; i++) {
    addStripe(road, i);
  }

  parent.add(road);
  return road;
};
