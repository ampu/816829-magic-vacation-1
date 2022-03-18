import * as THREE from 'three';

const SEGMENTS = 32;
const SPHERE_COLOR = 0xb3d1f2;

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
  color: 0xf8431d,
  zRotation: -90,
  heightSegments: 1,
};

const addSphere = (parent, {radius, y}) => {
  const geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: SPHERE_COLOR,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addNose = (parent) => {
  const height = Math.sqrt(NOSE.branch ** 2 - NOSE.radius ** 2);
  const x = Sphere.SMALL.radius + NOSE.offset - height + height / 2;
  const y = Sphere.SMALL.y;

  const geometry = new THREE.ConeGeometry(NOSE.radius, height, SEGMENTS, NOSE.heightSegments);

  const material = new THREE.MeshStandardMaterial({
    color: NOSE.color,
  });

  const object = new THREE.Mesh(geometry, material);
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
