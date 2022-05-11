import * as THREE from 'three';

import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';
import {ObjectName} from '3d/constants/object-name';

const PLANE_SIZE = 600;
export const Z_OFFSET = -405;
export const START_ANIMATION_POSITION = [0, 0, Z_OFFSET];

const KEYHOLE = {
  url: `./img/svg-forms/keyhole.svg`,
  height: 1995,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 20,
    bevelSize: 2,
    bevelThickness: 2,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.SOFT_DARK_PURPLE,
};

const addBackground = (parent) => {
  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);

  const material = Material.BASIC_PURPLE.clone();
  material.transparent = true;

  const object = new THREE.Mesh(geometry, material);
  object.name = ObjectName.KEYHOLE_BACKGROUND;
  object.position.z = -KEYHOLE.extrudeOptions.depth - 200;

  parent.add(object);
  return object;
};

export const addKeyhole = async (parent) => {
  const group = new THREE.Group();
  group.position.set(0, 0, Z_OFFSET);

  const keyhole = await loadSVGGroup(KEYHOLE);
  group.add(keyhole);

  addBackground(group);

  parent.add(group);
  return group;
};
