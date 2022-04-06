import clamp from 'lodash/clamp';

import {easeLinear} from './easings';

/**
 * @typedef {function(x: number): number} Calculator
 *
 * @typedef {{
 *   xRange?: [minX: number, maxX: number],
 *   yRange?: [startX: number, endX: number],
 *   onProgress?: Easing,
 * }} CalculatorRange - assert(minX <= maxX)
 *
 * @typedef {function(x: number): number[]} VectorCalculator
 *
 * @typedef {{
 *   xRange?: [minX: number, maxX: number],
 *   yRange?: [startX: number[], endX: number[]],
 *   onProgress?: Easing,
 * }} VectorCalculatorRange - assert(minX <= maxX)
 */

const {PI, E, min, max, sin, cos, atan, pow} = Math;

const HALF_CIRCLE_DEGREES = 180;
export const RADIANS_RATIO = PI / HALF_CIRCLE_DEGREES;
export const DEGREES_RATIO = HALF_CIRCLE_DEGREES / PI;
const MAX_PROGRESS = 1;
const DEFAULT_X_RANGE = [0, 1];
const DEFAULT_Y_RANGE = [0, 1];
const DEFAULT_VECTOR_Y_RANGE = [[0, 0, 0], [1, 1, 1]];

export const convertDegreesToRadians = (degrees) => degrees * RADIANS_RATIO;
export const convertRadiansToDegrees = (radians) => radians * DEGREES_RATIO;
export const convertTangentToDegrees = (tangent) => convertRadiansToDegrees(atan(tangent));

export const calculateTangentY1 = (x0, y0, x1, dy0) => dy0 * (x1 - x0) + y0;

export const rotatePoint = ([x, y], degrees = 0) => {
  const radians = convertDegreesToRadians(degrees);
  const cosine = cos(radians);
  const sine = sin(radians);
  return [
    x * cosine - y * sine,
    x * sine + y * cosine,
  ];
};

const calculateY = (x, minX, maxX, startY, endY, onProgress) => {
  x = clamp(x, minX, maxX);
  const progress = (x - minX) / (maxX - minX);
  const y = startY + (endY - startY) * onProgress(Number.isFinite(progress) ? progress : MAX_PROGRESS);
  return clamp(y, min(startY, endY), max(startY, endY));
};

/**
 * @param {CalculatorRange} arguments
 * @return {Calculator}
 */
export const createCalculator = ({
  xRange: [minX, maxX] = DEFAULT_X_RANGE,
  yRange: [startY, endY = startY] = DEFAULT_Y_RANGE,
  onProgress = easeLinear,
} = {}) => {
  if (!(minX <= maxX)) {
    throw new Error(`createCalculator(): minX (${minX}) shall not be more than maxX (${maxX})`);
  }
  return (x) => {
    return calculateY(x, minX, maxX, startY, endY, onProgress);
  };
};

/**
 * @param {VectorCalculatorRange} arguments
 * @return {VectorCalculator}
 */
export const createVectorCalculator = ({
  xRange: [minX, maxX] = DEFAULT_X_RANGE,
  yRange: [startY, endY = startY] = DEFAULT_VECTOR_Y_RANGE,
  onProgress = easeLinear,
} = {}) => {
  if (!(minX <= maxX)) {
    throw new Error(`createVectorCalculator(): minX (${minX}) shall not be more than maxX (${maxX})`);
  }
  return (x) => {
    return startY.map((_, i) => calculateY(x, minX, maxX, startY[i], endY[i], onProgress));
  };
};

/**
 * @param {VectorCalculatorRange} arguments
 * @return {VectorCalculator}
 */
export const createRotationCalculator = ({
  xRange: [minX, maxX] = DEFAULT_X_RANGE,
  yRange: [startY, endY = startY] = DEFAULT_VECTOR_Y_RANGE,
  onProgress = easeLinear,
} = {}) => {
  if (!(minX <= maxX)) {
    throw new Error(`createVectorCalculator(): minX (${minX}) shall not be more than maxX (${maxX})`);
  }
  return (x) => {
    return startY.map((_, i) => calculateY(x, minX, maxX, startY[i], endY[i], onProgress) * RADIANS_RATIO);
  };
};

export class NamedCalculator {
  constructor(name = ``, {xRange, yRange, onProgress}) {
    this.name = name;
    this.xRange = xRange;
    this.yRange = yRange;
    this.onProgress = onProgress;
    this.calculateY = createCalculator({xRange, yRange, onProgress});
  }
}

/**
 * @param {CalculatorRange[]} ranges
 * @return {Calculator}
 */
export const createCompositeCalculator = (ranges) => {
  let compositeMinX = +Infinity;
  let compositeMaxX = -Infinity;
  ranges.forEach(({xRange: [minX, maxX], yRange}, i) => {
    if (!(minX <= maxX)) {
      throw new Error(`createCompositeCalculator(): minX (${minX}) shall not be more than maxX (${maxX}) in #${i + 1}/${ranges.length}`);
    }

    compositeMinX = min(compositeMinX, minX);
    compositeMaxX = max(compositeMaxX, maxX);

    if (yRange.length === 1) {
      yRange.push(yRange[0]);
    }
  });

  return (x) => {
    x = clamp(x, compositeMinX, compositeMaxX);

    const currentRange = ranges.find(({xRange: [currentMinX]}, i) => {
      const nextMinX = i === ranges.length - 1
        ? +Infinity
        : ranges[i + 1].xRange[0];

      return currentMinX <= x && x < nextMinX;
    });

    const {
      xRange: [minX, maxX] = DEFAULT_X_RANGE,
      yRange: [startY, endY] = DEFAULT_Y_RANGE,
      onProgress = easeLinear,
    } = currentRange;

    return calculateY(x, minX, maxX, startY, endY, onProgress);
  };
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} amplitude
 * @return {{
 *   calculateY: (function(progress: number): number ),
 *   calculateTangent: (function(progress: number): number),
 * }}
 */
export const createSineCalculator = ({x = 0, y = 0, width = 1, height = 2, amplitude = 1} = {}) => {
  const ratio = 2 * PI / amplitude;
  return {
    calculateY: (progress) => height / 2 * sin(ratio * (width * progress + x)) + y,
    calculateTangent: (progress) => height / 2 * ratio * cos(ratio * (width * progress + x)),
  };
};

/**
 * @param {number} height
 * @param {number} amplitude
 * @param {number} phaseShift
 * @return {{
 *   calculateY: (function(progress: number): number ),
 * }}
 */
export const createPhaseShiftSineCalculator = ({height = 2, amplitude = 1, phaseShift = 0}) => {
  const doCalculateY = (x) => height / 2 * Math.sin(PI * (x / amplitude + phaseShift));
  return {
    calculateY: (x) => doCalculateY(x) - doCalculateY(0),
  };
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} amplitude
 * @param {number} fadingRatio
 * @return {{
 *   calculateY: (function(progress: number): number),
 * }}
 */
export const createFadingSineCalculator = ({x = 0, y = 0, width = 1, height = 2, amplitude = 1, fadingRatio = 1} = {}) => {
  const ratio = 2 * PI / amplitude;
  return {
    calculateY: (progress) => height / 2 * pow(E, -fadingRatio * progress / amplitude) * sin(ratio * (width * progress + x)) + y,
  };
};

/**
 * @param {CalculatorRange} range
 * @param {number} multiplier
 * @return {CalculatorRange}
 */
export const multiplyRange = ({xRange, yRange, onProgress}, multiplier) => {
  return {
    xRange: xRange.map((value) => value * multiplier),
    yRange,
    onProgress,
  };
};

/**
 * @param {CalculatorRange[]} ranges
 * @param {number} multiplier
 * @return {CalculatorRange[]}
 */
export const multiplyRanges = (ranges, multiplier) => {
  return ranges.map((range) => multiplyRange(range, multiplier));
};
