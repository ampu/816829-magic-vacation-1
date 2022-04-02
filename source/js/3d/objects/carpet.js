import * as THREE from 'three';
import {Color, Reflection} from '3d/materials/materials';
import CarpetMaterial from '3d/materials/carpet-material';
import {ObjectName} from '3d/constants/object-name';

const LATHE_SEGMENTS = 32;
const ITEM_COUNT = 7;
const WIDTH = 180;
const HEIGHT = 3;
const INNER_RADIUS = 763;
const PHI_START = 16;
const PHI_END = 74;

const POINTS = [
  new THREE.Vector2(INNER_RADIUS, 0),
  new THREE.Vector2(INNER_RADIUS + WIDTH, 0),
  new THREE.Vector2(INNER_RADIUS + WIDTH, HEIGHT),
  new THREE.Vector2(INNER_RADIUS, HEIGHT),
  new THREE.Vector2(INNER_RADIUS, 0),
];

const addCarpet = (parent, color, additionalColor) => {
  const geometry = new THREE.LatheGeometry(POINTS, LATHE_SEGMENTS, THREE.MathUtils.degToRad(PHI_START), THREE.MathUtils.degToRad(PHI_END - PHI_START));

  const material = new CarpetMaterial({
    itemCount: ITEM_COUNT,
    color,
    additionalColor,
    side: THREE.DoubleSide,
    ...Reflection.SOFT,
  });

  const object = new THREE.Mesh(geometry, material);
  object.name = ObjectName.CARPET;

  parent.add(object);
  return object;
};

export const addDogCarpet = (parent) => {
  return addCarpet(parent, Color.LIGHT_PURPLE, Color.ADDITIONAL_PURPLE);
};

export const addSonyaCarpet = (parent) => {
  return addCarpet(parent, Color.SHADOWED_LIGHT_PURPLE, Color.SHADOWED_ADDITIONAL_PURPLE);
};
