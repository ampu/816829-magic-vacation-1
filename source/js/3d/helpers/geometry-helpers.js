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
 * @param {Vector3} currentSize
 * @return {Vector3}
 */
export const scaleObjectToFitHeight = (object, height, currentSize = getObjectSize(object)) => {
  const scale = height / currentSize.y;
  object.scale.set(scale, scale, scale);
  return currentSize.clone().multiply(scale);
};

export const scaleObjectToFitSize = (object, [x, y, z], currentSize = getObjectSize(object)) => {
  const scaleX = x / currentSize.x;
  const scaleY = y / currentSize.y;
  const scaleZ = z / currentSize.z;
  object.scale.set(scaleX, scaleY, scaleZ);
  return new THREE.Vector3(x, y, z);
};

/**
 * @param {Object3D} object
 * @param {[number, number, number, string]} rotation
 */
export const rotateObjectInDegrees = (object, rotation) => {
  rotation = rotation.map((value) => Number.isFinite(value) ? THREE.MathUtils.degToRad(value) : value);
  object.rotation.set(...rotation);
};
