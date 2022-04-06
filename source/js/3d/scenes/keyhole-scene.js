import * as THREE from 'three';

import {CompositeAnimation} from 'helpers/composite-animation';
import {FrameAnimation} from 'helpers/frame-animation';
import {createPhaseShiftSineCalculator, createVectorCalculator} from 'helpers/calculator';
import {easeOutExpo, easeInOut} from 'helpers/easings';
import {wrapObject} from '3d/helpers/object-helpers';
import {generateIntegerByConstraint} from 'helpers/random-helpers';

import {addKeyhole, START_ANIMATION_POSITION} from '3d/objects/keyhole';
import {addFlamingo} from '3d/objects/flamingo';
import {addSnowflake} from '3d/objects/snowflake';
import {addWatermelon} from '3d/objects/watermelon';
import {addKeyholeSuitcase} from '3d/objects/suitcase';
import {addAirplane} from '3d/objects/airplane';
import {addQuestion} from '3d/objects/question';
import {addKeyholeSaturn} from '3d/objects/saturn';
import {addKeyholeLeaf} from '3d/objects/leaf';

const ANIMATION_DELAY = 1400;
const ANIMATION_DURATION = 1200;
const AIRPLANE_ANIMATION_DELAY = 2400;
const AIRPLANE_ANIMATION_DURATION = 800;

const BackgroundConstraint = {
  DELAY_OFFSET: {min: 100, max: 200},
  HEIGHT: {min: 10, max: 20},
  PERIOD: {min: 1000, max: 3000},
};

export const addKeyholeScene = async (parent) => {
  const scene = new THREE.Group();

  const [
    // eslint-disable-next-line no-unused-vars
    keyhole,
    flamingo,
    snowflake,
    watermelon,
    suitcase,
    airplane,
    question,
    saturn,
    leaf,
  ] = await Promise.all([
    addKeyhole(scene),
    addFlamingo(scene),
    addSnowflake(scene),
    addWatermelon(scene),
    addKeyholeSuitcase(scene),
    addAirplane(scene),
    addQuestion(scene),
    addKeyholeSaturn(scene),
    addKeyholeLeaf(scene),
  ]);

  const animation = new CompositeAnimation([
    flamingo,
    snowflake,
    watermelon,
    suitcase,
    airplane,
    question,
    saturn,
    leaf,
  ].map(({object, onRenderFrame}) => {
    const wrapper = wrapObject(object);

    const delay = object === airplane ? AIRPLANE_ANIMATION_DELAY : ANIMATION_DELAY;
    const duration = object === airplane ? AIRPLANE_ANIMATION_DURATION : ANIMATION_DURATION;

    const delayOffset = generateIntegerByConstraint(BackgroundConstraint.DELAY_OFFSET);
    const period = generateIntegerByConstraint(BackgroundConstraint.PERIOD);
    const height = generateIntegerByConstraint(BackgroundConstraint.HEIGHT);

    const startPosition = object.position.clone();
    const getPosition = createVectorCalculator({yRange: [START_ANIMATION_POSITION, Array.from(startPosition)]});

    const {calculateY: getBackgroundY} = createPhaseShiftSineCalculator({height, amplitude: period, phaseShift: Math.random()});

    return new CompositeAnimation([
      new FrameAnimation({
        name: `foreground`,
        delay,
        duration,
        onProgress: easeOutExpo,
        onRenderFrame(state) {
          const {progress} = state;

          object.scale.set(progress, progress, progress);
          object.position.set(...getPosition(progress));

          if (onRenderFrame) {
            onRenderFrame(state);
          }
        },
      }),
      new FrameAnimation({
        name: `background`,
        delay: delay + duration - delayOffset,
        duration: Infinity,
        shouldSkipDuplicates: false,
        onProgress: easeInOut,
        onRenderFrame({elapsed}) {
          wrapper.position.y = getBackgroundY(elapsed);
        },
      }),
    ]);
  }));

  parent.add(scene);
  return {
    scene,
    animation,
  };
};
