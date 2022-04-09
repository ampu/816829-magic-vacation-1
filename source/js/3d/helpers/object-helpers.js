import * as THREE from 'three';

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
  return currentSize.clone().multiplyScalar(scale);
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

/**
 * @param {Object3D} object
 * @param {number} radius
 * @param {number} degrees
 * @param {string} xProperty
 * @param {string} yProperty
 * @param {string} rotationAxis
 */
export const setPolarPosition2 = (object, radius, degrees, xProperty = `x`, yProperty = `y`, rotationAxis = `y`) => {
  const radians = THREE.MathUtils.degToRad(degrees);
  object.position[xProperty] = radius * Math.cos(radians);
  object.position[yProperty] = radius * Math.sin(radians);
  object.rotation[rotationAxis] = radians;
};

export const forEachMesh = (object, callback) => {
  object.traverse((child) => {
    if (child.type === `Mesh`) {
      callback(child);
    }
  });
};

export const findChildren = (object, names) => {
  return names.map((name) => {
    const child = object.getObjectByName(name);
    if (!child) {
      throw new Error(`findChildren(${name}): not found`);
    }
    return child;
  });
};

export const forEachMeshInChildren = (parentObject, childNames, callback) => {
  for (const object of findChildren(parentObject, childNames)) {
    forEachMesh(object, callback);
  }
};

export const setMeshMaterial = (object, material) => {
  forEachMesh(object, (mesh) => {
    mesh.material = material;
  });
};

export const castShadow = (parentObject, childNames) => {
  forEachMeshInChildren(parentObject, childNames, (mesh) => {
    mesh.castShadow = true;
  });
};

export const receiveShadow = (parentObject, childNames) => {
  forEachMeshInChildren(parentObject, childNames, (mesh) => {
    mesh.receiveShadow = true;
  });
};

/**
 * @param {Object3D} object
 * @return {Group}
 */
export const wrapObject = (object) => {
  const parent = object.parent;
  const wrapper = new THREE.Group();
  wrapper.add(object);
  if (parent) {
    parent.add(wrapper);
  }
  return wrapper;
};

export const centerObjectTransformOrigin = (object, keys = [`x`, `y`, `z`], size = getObjectSize(object)) => {
  for (const key of keys) {
    object.position[key] = -size[key] / 2;
  }
  return size;
};
