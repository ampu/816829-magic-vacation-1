import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Material} from '3d/materials/materials';
import {rotateObjectInDegrees, scaleObjectToFitSize} from '3d/helpers/geometry-helpers';

const WALL_URL = ` ./3d/module-6/rooms-scenes/common/WallCornerUnit.obj`;

const DOG_WALL = {
  size: [1350, 1000, 1350],
  position: [0, 0, 0],
  rotation: [0, 0, 0, `XYZ`],
  material: Material.SOFT_PURPLE,
};

const PYRAMID_WALL = {
  size: [1350, 1000, 1350],
  position: [0, 0, 0],
  rotation: [0, 0, 0, `XYZ`],
  material: Material.BASIC_BLUE,
};

const COMPASS_WALL = {
  size: [1350, 1000, 1350],
  position: [0, 0, 0],
  rotation: [0, 0, 0, `XYZ`],
  material: Material.SOFT_SKY_LIGHT_BLUE,
};

const SONYA_WALL = {
  size: [1350, 1000, 1350],
  position: [0, 0, 0],
  rotation: [0, 0, 0, `XYZ`],
  material: Material.BASIC_SHADOWED_PURPLE,
};

const addWall = async (parent, {size, position, rotation, material}) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(WALL_URL, resolve, null, reject);
  })
    .then((object) => {
      /** @param {Group} object */
      object.traverse((child) => {
        if (child.type === `Mesh`) {
          child.material = material;
        }
      });
      scaleObjectToFitSize(object, size);
      object.position.set(...position);
      rotateObjectInDegrees(object, rotation);

      parent.add(object);
      return object;
    });
};

export const addDogWall = (parent) => {
  return addWall(parent, DOG_WALL);
};

export const addPyramidWall = (parent) => {
  return addWall(parent, PYRAMID_WALL);
};

export const addCompassWall = (parent) => {
  return addWall(parent, COMPASS_WALL);
};

export const addSonyaWall = (parent) => {
  return addWall(parent, SONYA_WALL);
};
