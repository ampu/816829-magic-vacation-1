import * as THREE from 'three';

import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {Material} from '3d/materials/materials';

const PLANE_SIZE = 10000;

const KEYHOLE = {
  url: `./img/svg-forms/keyhole.svg`,
  height: 2000,
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

  const object = new THREE.Mesh(geometry, Material.BASIC_PURPLE);
  object.position.z = -KEYHOLE.extrudeOptions.depth;

  parent.add(object);
  return object;
};

export const addKeyhole = async (parent) => {
  const group = new THREE.Group();
  group.position.set(0, 0, -400);

  const keyhole = await loadSVGGroup(KEYHOLE);
  group.add(keyhole);

  addBackground(group);

  parent.add(group);
  return group;
};
