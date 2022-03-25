import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader';

const SCALED_EXTRUDE_OPTIONS = [`depth`, `bevelSize`, `bevelThickness`, `bevelOffset`];

const createDefaultGeometry = (shapes) => new THREE.ShapeGeometry(shapes);

const createDefaultMaterial = (color) => new THREE.MeshStandardMaterial({
  color,
  side: THREE.DoubleSide,
});

/**
 * @param {string} url
 * @param {number} height
 * @param {object} extrudeOptions
 * @param {function(color): THREE.Material} onGetMaterial
 * @return {Promise<Group>}
 */
export const loadSVGGroup = async ({url, height, extrudeOptions, onGetMaterial}) => {
  const svg = await loadSVG(url);

  const size = getPathsSize(svg.paths);
  const scale = height ? height / size.y : 1;

  if (scale !== 1) {
    extrudeOptions = Object.fromEntries(Object.entries(extrudeOptions).map(([key, value]) => {
      if (SCALED_EXTRUDE_OPTIONS.includes(key)) {
        value /= scale;
      }
      return [key, value];
    }));
  }

  const group = convertPathsToGroup(svg.paths, extrudeOptions, onGetMaterial);
  group.scale.set(scale, -scale, scale);
  group.position.y = size.y * scale;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
};

/**
 * @param {string} url
 * @return {Promise<{
 *   paths: THREE.ShapePath[],
 * 	 xml: XMLDocument,
 * }>}
 */
const loadSVG = async (url) => {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader();
    loader.load(url, resolve, null, reject);
  });
};

/**
 * @param {THREE.ShapePath[]} paths
 * @return {Vector3}
 */
const getPathsSize = (paths) => {
  const group = new THREE.Group();
  for (const path of paths) {
    addPathMesh(group, path);
  }
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3().copy(box.min).sub(box.max);
  size.x = Math.abs(size.x);
  size.y = Math.abs(size.y);
  size.z = Math.abs(size.z);
  return size;
};

/**
 * @param {THREE.ShapePath[]} paths
 * @param {object} extrudeOptions
 * @param {function(color): THREE.Material} onGetMaterial
 * @return {Group}
 */
const convertPathsToGroup = (paths, extrudeOptions, onGetMaterial) => {
  const group = new THREE.Group();
  for (const path of paths) {
    addPathMesh(group, path, onGetMaterial, (shapes) => new THREE.ExtrudeGeometry(shapes, extrudeOptions));
  }
  return group;
};

/**
 * @param {THREE.Object3D} parent
 * @param {THREE.ShapePath} path
 * @param {function(color): THREE.Material} onGetMaterial
 * @param {function(shapes: THREE.Shape[]): THREE.Geometry} onGetGeometry
 * @return {THREE.Object3D}
 */
const addPathMesh = (parent, path, onGetMaterial = createDefaultMaterial, onGetGeometry = createDefaultGeometry) => {
  const material = onGetMaterial(path.color);

  const geometry = onGetGeometry(SVGLoader.createShapes(path));

  const mesh = new THREE.Mesh(geometry, material);
  parent.add(mesh);
  return mesh;
};
