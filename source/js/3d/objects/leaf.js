import * as THREE from 'three';

import {ObjectName} from '3d/constants/object-name';
import {Material} from '3d/materials/materials';

import {loadSVGGroup} from '3d/helpers/svg-helpers';
import {rotateObjectInDegrees, scaleObjectToFitHeight, wrapObject} from '3d/helpers/object-helpers';
import {createFadingSineCalculator, createRotationCalculator} from 'helpers/calculator';
import {FrameAnimation} from 'helpers/frame-animation';

const KEYHOLE_LEAF_SVG = {
  url: `./img/svg-forms/leaf.svg`,
  height: 128,
  extrudeOptions: {
    curveSegments: 32,
    bevelSegments: 8,
    depth: 1,
    bevelSize: 1,
    bevelThickness: 1,
    bevelOffset: 0,
  },
  onGetMaterial: () => Material.BASIC_GREEN,
};

const KEYHOLE_LEAF = {
  position: [436, 175, 0],
  rotation: [25, -60, -45, `XYZ`],
};

const PYRAMID_BIG_LEAF = {
  name: ObjectName.BIG_LEAF,
  height: 340,
  position: [85, 0, 260],
  rotation: [0, 90, 0, `XYZ`],
  animationDelay: 1000,
  fadingIterationDuration: 1000,
  animationIterationDuration: 2000,
  rotationAmplitude: 20,
  phaseShift: 0,
};

const PYRAMID_SMALL_LEAF = {
  name: ObjectName.SMALL_LEAF,
  height: 150,
  position: [98, 5, 350],
  rotation: [30, 90, 0, `XYZ`],
  animationDelay: 1200,
  fadingIterationDuration: 1000,
  animationIterationDuration: 2000,
  rotationAmplitude: 20,
  phaseShift: 1 / 2,
};

export const addKeyholeLeaf = async (parent) => {
  const object = await loadSVGGroup(KEYHOLE_LEAF_SVG);
  rotateObjectInDegrees(object, KEYHOLE_LEAF.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...KEYHOLE_LEAF.position);
  parent.add(wrapper);

  const getRotation = createRotationCalculator({yRange: [[0, -60, -15], [0, 0, 0]]});
  return {
    object: wrapper,
    onRenderFrame({progress}) {
      wrapper.rotation.set(...getRotation(progress));
    }
  };
};

const addHistoryLeaf = async (parent, {
  name,
  height,
  position,
  rotation,
  animationDelay,
  fadingIterationDuration,
  animationIterationDuration,
  rotationAmplitude,
  phaseShift,
}) => {
  const object = await loadSVGGroup({...KEYHOLE_LEAF_SVG, shouldCenterAxes: false});
  const objectSize = scaleObjectToFitHeight(object, height);
  object.position.set(-objectSize.x, objectSize.y, 0);

  const wrapper = wrapObject(object);
  wrapper.name = name;
  wrapper.position.set(...position);
  rotateObjectInDegrees(wrapper, rotation);

  const sineCalculator = createFadingSineCalculator({
    x: phaseShift * fadingIterationDuration,
    amplitude: fadingIterationDuration,
    fadingRatio: 2,
  });

  parent.add(wrapper);
  return {
    object: wrapper,
    animation: new FrameAnimation({
      delay: animationDelay,
      duration: Infinity,
      onRenderFrame({elapsed}) {
        elapsed %= animationIterationDuration;

        const sine = sineCalculator.calculateY(elapsed);
        const rotationOffset = sine * rotationAmplitude / 2;
        wrapper.rotation.x = THREE.MathUtils.degToRad(rotation[0] + rotationOffset);
      },
    }),
  };
};

export const addPyramidBigLeaf = async (parent) => {
  return addHistoryLeaf(parent, PYRAMID_BIG_LEAF);
};

export const addPyramidSmallLeaf = async (parent) => {
  return addHistoryLeaf(parent, PYRAMID_SMALL_LEAF);
};
