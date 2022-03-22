import * as THREE from 'three';

const LATHE_SEGMENTS = 32;
const CARPET_COUNT = 7;
const WIDTH = 180;
const HEIGHT = 3;
const INNER_RADIUS = 763;
const PHI_START = 16;
const PHI_END = 74;
const DARK_COLOR = 0x664d9f;
const LIGHT_COLOR = 0xa483cf;

const POINTS = [
  new THREE.Vector2(INNER_RADIUS, 0),
  new THREE.Vector2(INNER_RADIUS + WIDTH, 0),
  new THREE.Vector2(INNER_RADIUS + WIDTH, HEIGHT),
  new THREE.Vector2(INNER_RADIUS, HEIGHT),
  new THREE.Vector2(INNER_RADIUS, 0),
];

const addCarpetItem = (parent, carpetIndex) => {
  const phiLength = (PHI_END - PHI_START) / CARPET_COUNT;
  const phiStart = PHI_START + carpetIndex * phiLength;
  const geometry = new THREE.LatheGeometry(POINTS, LATHE_SEGMENTS, THREE.MathUtils.degToRad(phiStart), THREE.MathUtils.degToRad(phiLength));

  const material = new THREE.MeshStandardMaterial({
    color: carpetIndex % 2 === 0 ? LIGHT_COLOR : DARK_COLOR,
    side: THREE.DoubleSide,
  });

  const object = new THREE.Mesh(geometry, material);

  parent.add(object);
  return object;
};

export const addCarpet = (parent) => {
  const carpet = new THREE.Group();
  carpet.position.y = 10;
  for (let i = 0; i < CARPET_COUNT; i++) {
    addCarpetItem(carpet, i);
  }
  parent.add(carpet);
  return carpet;
};
