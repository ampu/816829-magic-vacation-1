import * as THREE from 'three';
import {Color, Reflection} from '3d/materials/materials';
import RoadMaterial from '3d/materials/road-material';

const LATHE_SEGMENTS = 32;

const WIDTH = 160;
const HEIGHT = 3;
const INNER_RADIUS = 732;
const PHI_START = 0;
const PHI_END = 90;

const STRIPE_COUNT = 4;
const STRIPE_WIDTH = 20;
const STRIPE_OFFSET = -1 / 5;

export const addRoad = (parent) => {
  const points = [
    new THREE.Vector2(INNER_RADIUS, HEIGHT),
    new THREE.Vector2(INNER_RADIUS + WIDTH, HEIGHT),
    new THREE.Vector2(INNER_RADIUS + WIDTH, 0),
    new THREE.Vector2(INNER_RADIUS, 0),
    new THREE.Vector2(INNER_RADIUS, HEIGHT),
  ];
  const geometry = new THREE.LatheGeometry(points, LATHE_SEGMENTS, THREE.MathUtils.degToRad(PHI_START), THREE.MathUtils.degToRad(PHI_END - PHI_START));

  const material = new RoadMaterial({
    width: WIDTH,
    color: Color.GREY,
    stripOffset: STRIPE_OFFSET,
    stripeCount: STRIPE_COUNT,
    stripeWidth: STRIPE_WIDTH,
    stripeColor: Color.WHITE,
    side: THREE.DoubleSide,
    ...Reflection.SOFT,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.y = 500;

  parent.add(object);
  return object;
};
