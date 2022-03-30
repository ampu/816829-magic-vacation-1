import * as THREE from 'three';

export const squashTorusGeometry = (geometry, height, isSmooth, epsilon = 0.001) => {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const z = position.getZ(i);
    if (isSmooth) {
      if (Math.abs(z) > height / 2) {
        position.setZ(i, Math.sign(z) * height / 2);
      }
    } else {
      if (Math.abs(z) > epsilon) {
        position.setZ(i, Math.sign(z) * height / 2);
      }
    }
  }
  geometry.computeVertexNormals();
  return geometry;
};

/**
 * @param {Object3D} object
 * @return {Vector3}
 */
export const getObjectSize = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3().copy(box.min).sub(box.max);
  size.x = Math.abs(size.x);
  size.y = Math.abs(size.y);
  size.z = Math.abs(size.z);
  return size;
};

/**
 * @param {Object3D} object
 * @param {number} height
 * @param {Vector3} size
 * @return {Vector3}
 */
export const scaleObjectToFitHeight = (object, height, size = getObjectSize(object)) => {
  const scale = height / size.y;
  object.scale.set(scale, scale, scale);
  return size.clone().multiply(scale);
};

/**
 * @param {Object3D} object
 * @param {[number, number, number, string]} rotation
 */
export const rotateObjectInDegrees = (object, rotation) => {
  rotation = rotation.map((value) => Number.isFinite(value) ? THREE.MathUtils.degToRad(value) : value);
  object.rotation.set(...rotation);
};
