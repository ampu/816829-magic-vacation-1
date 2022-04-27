import clamp from 'lodash/clamp';

import {easeLinear} from './easings';

/**
 * @typedef {function(t: number): number} Calculator
 *
 * @typedef {{
 *   calculateY: function(t: number): number,
 *   calculateTangent: function(t: number): number,
 * }} TangentCalculator
 *
 * @typedef {{
 *   xRange?: [minX: number, maxX: number],
 *   yRange?: [startX: number, endX: number],
 *   onProgress?: Easing,
 * }} CalculatorRange - assert(minX <= maxX)
 *
 * @typedef {function(x: number, progress: number): number} CompositeItemCalculator
 *
 * @typedef {{
 *   xRange?: [minX: number, maxX: number],
 *   calculate?: Calculator | CompositeItemCalculator,
 *   isBasedOnProgress?: boolean,
 * }} CompositeCalculatorRange - assert(minX <= maxX)
 *
 * @typedef {function(x: number): number[]} VectorCalculator
 *
 * @typedef {{
 *   xRange?: [minX: number, maxX: number],
 *   yRange?: [startX: number[], endX: number[]],
 *   onProgress?: Easing,
 * }} VectorCalculatorRange - assert(minX <= maxX)
 */

const {PI, E, sign, min, max, sin, cos, atan, pow, log} = Math;

export const RADIAN = 180 / PI;
const MAX_PROGRESS = 1;
const DEFAULT_X_RANGE = [0, 1];
const DEFAULT_Y_RANGE = [0, 1];
const DEFAULT_VECTOR_Y_RANGE = [[0, 0, 0], [1, 1, 1]];

export const convertDegreesToRadians = (degrees) => degrees / RADIAN;
export const convertRadiansToDegrees = (radians) => radians * RADIAN;
export const convertTangentToDegrees = (tangent) => convertRadiansToDegrees(atan(tangent));

export const calculateTangentY1 = (x0, y0, x1, dy0) => dy0 * (x1 - x0) + y0;

export const rotatePoint = ([x, y], degrees = 0) => {
  const radians = degrees / RADIAN;
  const cosine = cos(radians);
  const sine = sin(radians);
  return [
    x * cosine - y * sine,
    x * sine + y * cosine,
  ];
};

const calculateProgress = (x, minX, maxX) => {
  x = clamp(x, minX, maxX);
  const progress = (x - minX) / (maxX - minX);
  return Number.isFinite(progress) ? progress : MAX_PROGRESS;
};

const calculateY = (x, minX, maxX, startY, endY, onProgress) => {
  const progress = calculateProgress(x, minX, maxX);
  const y = startY + (endY - startY) * onProgress(progress);
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
    return startY.map((_, i) => calculateY(x, minX, maxX, startY[i], endY[i], onProgress) / RADIAN);
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
export const createRangesCalculator = (ranges) => {
  return createCompositeCalculator(ranges.map((range) => {
    return {
      xRange: range.xRange,
      calculate: createCalculator(range),
    };
  }), false);
};

/**
 * @param {CompositeCalculatorRange[]} ranges
 * @param {boolean} isAllBasedOnProgress
 * @return {Calculator}
 */
export const createCompositeCalculator = (ranges, isAllBasedOnProgress = false) => {
  let compositeMinX = +Infinity;
  let compositeMaxX = -Infinity;
  ranges.forEach(({xRange: [minX, maxX] = DEFAULT_X_RANGE}, i) => {
    if (!(minX <= maxX)) {
      throw new Error(`createCompositeCalculator(): minX (${minX}) shall not be more than maxX (${maxX}) in #${i + 1}/${ranges.length}`);
    }
    compositeMinX = min(compositeMinX, minX);
    compositeMaxX = max(compositeMaxX, maxX);
  });

  return (x) => {
    x = clamp(x, compositeMinX, compositeMaxX);

    const currentRange = ranges.find(({xRange: [currentMinX] = DEFAULT_X_RANGE}, i) => {
      const nextMinX = i === ranges.length - 1
        ? +Infinity
        : ranges[i + 1].xRange[0];

      return currentMinX <= x && x < nextMinX;
    });

    const {
      xRange: [minX, maxX] = DEFAULT_X_RANGE,
      calculate,
      isBasedOnProgress = isAllBasedOnProgress,
    } = currentRange;

    return calculate(isBasedOnProgress ? calculateProgress(x, minX, maxX) : x);
  };
};

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {TangentCalculator}
 */
export const createLineCalculator = ([x1, y1] = [0, 0], [x2, y2] = [1, 1]) => {
  return {
    calculateY: (t) => (t - x1) / (x2 - x1) * (y2 - y1) + y1,
    calculateTangent: () => (y2 - y1) / (x2 - x1),
  };
};

/**
 * @param {number} minX
 * @param {number} maxX
 * @return {TangentCalculator}
 */
export const createFadingCalculator = ([minX, maxX]) => {
  const line = createLineCalculator([minX, 1], [maxX, 0]);
  return {
    calculateY: (t) => minX <= t && t <= maxX ? line.calculateY(t) : Number(t < minX),
    calculateTangent: (t) => minX <= t && t <= maxX ? line.calculateTangent(t) : 0,
  };
};

/**
 * @param {number} ratio
 * @param {number} base
 * @return {TangentCalculator}
 */
export const createInfiniteFadingCalculator = (ratio = 1, base = E) => {
  return {
    calculateY: (t) => base ** (-ratio * t),
    calculateTangent: (t) => -ratio * log(base) * base ** (-ratio * t)
  };
};

/**
 * @return {{
 *   calculateY: (function(t: number): number),
 *   calculateTangent: (function(t: number): number),
 * }}
 */
export const createSineCalculator = ({
  swing = 2,
  y = 0,
  period = 1,
  x = 0,
  ratio = 1,
} = {}) => {
  return {
    calculateY: (t) => ratio * (swing / 2 * sin(2 * PI / period * (t + x)) + y),
    calculateTangent: (t) => sign(ratio) * 2 * PI / period * swing / 2 * cos(2 * PI / period * (t + x)),
  };
};

/**
 * @param {TangentCalculator} calculator
 * @param {number} t0
 * @return {TangentCalculator}
 */
export const createDifferenceCalculator = (calculator, t0 = 0) => {
  const y0 = calculator.calculateY(t0);
  const tangent0 = calculator.calculateTangent(t0);
  return {
    calculateY: (t) => calculator.calculateY(t) - y0,
    calculateTangent: (t) => calculator.calculateTangent(t) - tangent0,
  };
};

/**
 * @param {TangentCalculator} calculator
 * @param {TangentCalculator} otherCalculator
 * @return {TangentCalculator}
 */
export const createMultiplicationCalculator = ([calculator, otherCalculator]) => {
  return {
    calculateY: (t) => calculator.calculateY(t) * otherCalculator.calculateY(t),
    calculateTangent: (t) => calculator.calculateTangent(t) * otherCalculator.calculateY(t) + calculator.calculateY(t) * otherCalculator.calculateTangent(t),
  };
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} amplitude
 * @param {number} fadingRatio
 * @return {{calculateY: Calculator}}
 */
export const createFadingSineCalculator = ({x = 0, y = 0, tRatio = 1, height = 2, amplitude = 1, fadingRatio = 1} = {}) => {
  return {
    calculateY: (t) => height / 2 * pow(E, -fadingRatio * t / amplitude) * sin(2 * PI / amplitude * (tRatio * t + x)) + y,
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

export const dumpCalculator = (calculator, [minX, maxX] = [0, 1], step = (maxX - minX) / 4, keyFractionDigits = 2, valueFractionDigits = 1) => {
  const y = {};
  const degrees = {};
  for (let x = minX; x <= maxX; x += step) {
    y[x.toFixed(keyFractionDigits)] = Number(calculator.calculateY(x).toFixed(valueFractionDigits));
    degrees[x.toFixed(keyFractionDigits)] = Number(convertTangentToDegrees(calculator.calculateTangent(x)).toFixed(valueFractionDigits));
  }
  // eslint-disable-next-line no-console
  console.log({y, degrees});
};
