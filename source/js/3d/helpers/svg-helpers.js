import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader';
import {getObjectSize, wrapObject} from '3d/helpers/object-helpers';

const SCALED_EXTRUDE_OPTIONS = [`depth`, `bevelSize`, `bevelThickness`, `bevelOffset`];

const createDefaultGeometry = (shapes) => new THREE.ShapeGeometry(shapes);

const createDefaultMaterial = (color) => new THREE.MeshStandardMaterial({
  color,
  side: THREE.DoubleSide,
});

/**
 * @param {string} url
 * @param {number?} width
 * @param {number} height
 * @param {object} extrudeOptions
 * @param {function(color): THREE.Material} onGetMaterial
 * @return {Promise<Group>}
 */
export const loadSVGGroup = async ({url, width, height, extrudeOptions, onGetMaterial}) => {
  const svg = await loadSVG(url);

  const size = getPathsSize(svg.paths);
  const rawScaleY = height ? height / size.y : undefined;
  const rawScaleX = width ? width / size.x : undefined;
  const scaleX = rawScaleY || rawScaleX || 1;
  const scaleY = rawScaleX || rawScaleY || 1;

  if (scaleY !== 1) {
    extrudeOptions = Object.fromEntries(Object.entries(extrudeOptions).map(([key, value]) => {
      if (SCALED_EXTRUDE_OPTIONS.includes(key)) {
        value /= scaleY;
      }
      return [key, value];
    }));
  }

  const group = convertPathsToGroup(svg.paths, extrudeOptions, onGetMaterial);
  group.scale.set(scaleX, -scaleY, 1);
  group.position.set(-size.x * scaleX / 2, size.y * scaleY / 2);

  return wrapObject(group);
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
  return getObjectSize(group);
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
