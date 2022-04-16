import * as THREE from 'three';

import {convertDegreesToRadians, convertRadiansToDegrees, convertTangentToDegrees, createCalculator, createCompositeCalculator, createSineCalculator} from 'helpers/calculator';

const Z_PERIOD_HALF = 200;

export const createAirplaneRig = (object) => {
  const [, startY, startZ] = [95, -74, -450];
  const [endX, endY, endZ] = object.position.toArray();
  const [endRotationX, endRotationY, endRotationZ] = object.rotation.toArray().map(convertRadiansToDegrees);

  const xCalculator = createSineCalculator({
    swing: 2 * endX / Z_PERIOD_HALF,
    y: -endX / Z_PERIOD_HALF,
    period: 2.5,
    x: 0.25,
    ratio: -Z_PERIOD_HALF,
  });

  const getX = xCalculator.calculateY;
  const getY = createCalculator({yRange: [startY, endY]});
  const getZ = createCalculator({yRange: [startZ, endZ]});

  const getXRotation = createCalculator({xRange: [0.6, 1], yRange: [-30, endRotationX]});
  const doGetYRotation = (progress) => convertTangentToDegrees(xCalculator.calculateTangent(progress));
  const getYRotation = createCompositeCalculator([
    {xRange: [0, 0.6], calculate: doGetYRotation},
    {xRange: [0.6, 1], calculate: createCalculator({yRange: [doGetYRotation(0.6), endRotationY]}), isBasedOnProgress: true},
  ]);
  const getZRotation = createCalculator({xRange: [0.6, 1], yRange: [-60, endRotationZ]});

  const state = {
    scale: object.scale.clone(),
    isScaleChanged: false,
    position: object.position.clone(),
    isPositionChanged: false,
    rotation: object.rotation.clone(),
    isRotationChanged: false,
  };

  return {
    setScale(progress) {
      const newScale = new THREE.Vector3().setScalar(progress);
      if (newScale.equals(state.scale)) {
        return;
      }
      state.scale = newScale;
      state.isScaleChanged = true;
    },
    setPosition(progress) {
      const newPosition = new THREE.Vector3(getX(progress), getY(progress), getZ(progress));
      if (newPosition.equals(state.position)) {
        return;
      }
      state.position = newPosition;
      state.isPositionChanged = true;
    },
    setRotation(progress) {
      const xRotation = getXRotation(progress);
      const yRotation = getYRotation(progress);
      const zRotation = getZRotation(progress);
      const newRotation = new THREE.Euler(...[xRotation, yRotation, zRotation].map(convertDegreesToRadians), `XYZ`);
      if (newRotation.equals(state.rotation)) {
        return;
      }
      state.rotation = newRotation;
      state.isRotationChanged = true;
    },
    invalidate() {
      if (state.isScaleChanged) {
        object.scale.copy(state.scale);
        state.isScaleChanged = false;
      }

      if (state.isPositionChanged) {
        object.position.copy(state.position);
        state.isPositionChanged = false;
      }

      if (state.isRotationChanged) {
        object.rotation.copy(state.rotation);
        state.isRotationChanged = false;
      }
    },
  };
};
