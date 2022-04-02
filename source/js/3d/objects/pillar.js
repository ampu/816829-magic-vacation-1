import * as THREE from 'three';
import range from 'lodash/range';

import {Material} from '3d/materials/materials';
import {setPolarPosition2} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';

const PILLAR = {
  radius: 12,
  height: 90,
  segments: 32,
  polarRadius: 680,
  polarAngles: range(5).map((i) => 12 + i * 16),
};

const addPillar = (parent) => {
  const geometry = new THREE.CylinderGeometry(PILLAR.radius, PILLAR.radius, PILLAR.height, PILLAR.segments, PILLAR.segments);

  const object = new THREE.Mesh(geometry, Material.BASIC_GREY);
  object.position.y = PILLAR.height / 2;

  parent.add(object);
  return object;
};

export const addCompassPillars = (parent) => {
  const object = new THREE.Group();
  object.name = ObjectName.PILLARS;

  for (const polarAngle of PILLAR.polarAngles) {
    setPolarPosition2(addPillar(object), PILLAR.polarRadius, polarAngle, `z`, `x`, `y`);
  }

  parent.add(object);
  return object;
};
