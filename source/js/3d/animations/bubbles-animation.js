import {calculateIteration, FrameAnimation} from 'helpers/frame-animation';
import {generate} from 'helpers/random-helpers';
import {createCalculator, createFadingSineCalculator, NamedCalculator} from 'helpers/calculator';

const HUE_ROTATION_ITERATION_DURATION = 1000;

const Bubble = {
  FIRST: {
    radius: 0.1,
    delay: 0,
  },
  SECOND: {
    radius: 0.066,
    delay: 500,
  },
  THIRD: {
    radius: 0.033,
    delay: 1000,
  },
};

const BUBBLES = Object.values(Bubble);

const bubbleCalculators = [
  {
    getX: createFadingSineCalculator({x: 2 / 3, y: 0.4, tRatio: 3, height: 0.2}).calculateY,
    getY: createCalculator({
      xRange: [Bubble.FIRST.delay, Bubble.FIRST.delay + 1800],
      yRange: [0 - Bubble.FIRST.radius, 1 + Bubble.FIRST.radius],
    }),
  },
  {
    getX: createFadingSineCalculator({x: 1 / 3, y: 0.25, tRatio: 3, height: 0.1}).calculateY,
    getY: createCalculator({
      xRange: [Bubble.SECOND.delay, Bubble.SECOND.delay + 1800],
      yRange: [0 - Bubble.SECOND.radius, 1 + Bubble.SECOND.radius],
    }),
  },
  {
    getX: createFadingSineCalculator({x: 0, y: 0.48, tRatio: 3, height: 0.05}).calculateY,
    getY: createCalculator({
      xRange: [Bubble.THIRD.delay, Bubble.THIRD.delay + 1800],
      yRange: [0 - Bubble.THIRD.radius, 1 + Bubble.THIRD.radius],
    }),
  },
];

export const createBubblesAnimation = ({
  slideHueRotation: [startSlideHueRotation, endSlideHueRotation] = [0, -20],
  bubblesUniform,
  hueRotationUniform,
  onDoRenderFrame,
}) => {
  let hueRotationCalculator = null;
  return new FrameAnimation({
    delay: 500,
    duration: 1800 + Bubble.THIRD.delay,
    onRenderFrame({progress, elapsed}) {
      const iteration = calculateIteration(elapsed, HUE_ROTATION_ITERATION_DURATION);
      const iterationProgress = (elapsed % HUE_ROTATION_ITERATION_DURATION) / HUE_ROTATION_ITERATION_DURATION;
      if (!hueRotationCalculator || hueRotationCalculator.name !== iteration) {
        const middleSlideHueRotation = (startSlideHueRotation + endSlideHueRotation) / 2;
        const isEven = iteration % 2 === 0;

        const startIterationHueRotation = iteration === 0 ? startSlideHueRotation : hueRotationCalculator.yRange[1];
        const endIterationHueRotation = isEven ? endSlideHueRotation : startSlideHueRotation;
        const randomEndIterationHueRotation = generate(middleSlideHueRotation, endIterationHueRotation);

        hueRotationCalculator = new NamedCalculator(iteration, {yRange: [startIterationHueRotation, randomEndIterationHueRotation]});
      }

      hueRotationUniform.value = hueRotationCalculator.calculateY(iterationProgress);

      bubbleCalculators.forEach(({getX, getY}, i) => {
        const bubbleValue = bubblesUniform.value[i];
        if (getX && getY) {
          bubbleValue.set(getX(progress), getY(elapsed), BUBBLES[i].radius);
        }
      });
      if (onDoRenderFrame) {
        onDoRenderFrame();
      }
    },
  });
};
