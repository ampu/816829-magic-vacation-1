import * as THREE from 'three';

const CIRCLE_SEGMENTS = 32;
const SQUARE_SEGMENTS = 4;
const LINE_SEGMENTS = 1;

const Color = {
  DARK: 0x1e76f1,
  LIGHT: 0x93b3f8,
};

const LANTERN_TOP = {
  topRadius: 45 / Math.sqrt(2),
  height: 6,
  bottomRadius: 57 / Math.sqrt(2),
};

const LANTERN_MIDDLE = {
  topRadius: 42 / Math.sqrt(2),
  height: 60,
  bottomRadius: 34 / Math.sqrt(2),
};

const LANTERN_BOTTOM = {
  topRadius: 37 / Math.sqrt(2),
  height: 4,
  bottomRadius: 37 / Math.sqrt(2),
};

const BODY = {
  radius: 7,
  height: 230,
  yOffset: 5,
};

const JOINT = {
  radius: 16,
};

const BASE = {
  radius: 16,
  height: 120,
};

const addLanternTop = (parent, bottomY) => {
  const y = bottomY + LANTERN_TOP.height / 2;

  const geometry = new THREE.CylinderGeometry(LANTERN_TOP.topRadius, LANTERN_TOP.bottomRadius, LANTERN_TOP.height, SQUARE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.DARK,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addLanternMiddle = (parent, bottomY) => {
  const y = bottomY + LANTERN_MIDDLE.height / 2;

  const geometry = new THREE.CylinderGeometry(LANTERN_MIDDLE.topRadius, LANTERN_MIDDLE.bottomRadius, LANTERN_MIDDLE.height, SQUARE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.LIGHT,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addLanternBottom = (parent, bottomY) => {
  const y = bottomY + LANTERN_BOTTOM.height / 2;

  const geometry = new THREE.CylinderGeometry(LANTERN_BOTTOM.topRadius, LANTERN_BOTTOM.bottomRadius, LANTERN_BOTTOM.height, SQUARE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.DARK,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addBody = (parent, bottomY) => {
  const y = bottomY + BODY.height / 2 - BODY.yOffset;

  const geometry = new THREE.CylinderGeometry(BODY.radius, BODY.radius, BODY.height, CIRCLE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.DARK,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addJoint = (parent, y) => {
  const geometry = new THREE.SphereGeometry(JOINT.radius, CIRCLE_SEGMENTS, CIRCLE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.DARK,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, y, 0);

  parent.add(object);
  return object;
};

const addBase = (parent) => {
  const geometry = new THREE.CylinderGeometry(BASE.radius, BASE.radius, BASE.height, CIRCLE_SEGMENTS, LINE_SEGMENTS);

  const material = new THREE.MeshStandardMaterial({
    color: Color.DARK,
  });

  const object = new THREE.Mesh(geometry, material);
  object.position.set(0, BASE.height / 2, 0);

  parent.add(object);
  return object;
};

export const addLamppost = (parent) => {
  const lamppost = new THREE.Group();

  addLanternTop(lamppost, BASE.height + JOINT.radius + BODY.height - BODY.yOffset + LANTERN_BOTTOM.height + LANTERN_MIDDLE.height);
  addLanternMiddle(lamppost, BASE.height + JOINT.radius + BODY.height - BODY.yOffset + LANTERN_BOTTOM.height);
  addLanternBottom(lamppost, BASE.height + JOINT.radius + BODY.height - BODY.yOffset);
  addBody(lamppost, BASE.height + JOINT.radius);
  addJoint(lamppost, BASE.height);
  addBase(lamppost);

  parent.add(lamppost);
  return lamppost;
};
