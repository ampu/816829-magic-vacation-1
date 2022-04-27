import * as THREE from 'three';

import {ObjectName} from '3d/constants/object-name';
import {CompositeAnimation} from 'helpers/composite-animation';
import {FrameAnimation} from 'helpers/frame-animation';
import {createDifferenceCalculator, createSineCalculator, createVectorCalculator} from 'helpers/calculator';
import {easeOutExpo, easeInOut} from 'helpers/easings';
import {wrapObject} from '3d/helpers/object-helpers';
import {generateIntegerByConstraint} from 'helpers/random-helpers';

import {addKeyhole, START_ANIMATION_POSITION, Z_OFFSET} from '3d/objects/keyhole';
import {addFlamingo} from '3d/objects/flamingo';
import {addSnowflake} from '3d/objects/snowflake';
import {addWatermelon} from '3d/objects/watermelon';
import {addKeyholeSuitcase} from '3d/objects/suitcase';
import {addAirplane} from '3d/objects/airplane';
import {addQuestion} from '3d/objects/question';
import {addKeyholeSaturn} from '3d/objects/saturn';
import {addKeyholeLeaf} from '3d/objects/leaf';

import {addDirectionalLight, addHemisphereLight, addLightGroup, addPointLight1, addPointLight2} from '3d/lights/lights';

const OBJECT_NAME_TO_TIMELINE = {
  [``]: {delay: 1400, duration: 1200},
  [ObjectName.AIRPLANE]: {delay: 2300, duration: 900},
  [ObjectName.SUITCASE]: {delay: 1700, duration: 800},
};

const BackgroundConstraint = {
  DELAY_OFFSET: {min: 100, max: 200},
  HEIGHT: {min: 10, max: 20},
  PERIOD: {min: 2000, max: 6000},
};

const KEYHOLE_SCENE_HEIGHT = 920;
const DEFAULT_CAMERA_POSITION = {x: 0, y: 0, z: 1000};
const KEYHOLE_SCENE_POSITION = [Math.sqrt((3270 - Z_OFFSET) ** 2 / 2), KEYHOLE_SCENE_HEIGHT, Math.sqrt((3270 - Z_OFFSET) ** 2 / 2)];

export const addKeyholeScene = async (parent) => {
  const scene = new THREE.Group();
  scene.name = ObjectName.KEYHOLE_SCENE;
  scene.position.set(...KEYHOLE_SCENE_POSITION);
  scene.rotation.y = Math.PI / 4;

  const lightGroup = addLightGroup(scene, DEFAULT_CAMERA_POSITION);
  addHemisphereLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addDirectionalLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addPointLight1(scene, lightGroup);
  addPointLight2(scene, lightGroup);

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
    question,
    saturn,
    leaf,
    airplane,
  ].map(({object, isExclusiveAnimation, onRenderFrame, rig}) => {
    const wrapper = wrapObject(object);

    const {delay, duration} = OBJECT_NAME_TO_TIMELINE[object.name] || OBJECT_NAME_TO_TIMELINE[``];

    const delayOffset = generateIntegerByConstraint(BackgroundConstraint.DELAY_OFFSET);
    const period = generateIntegerByConstraint(BackgroundConstraint.PERIOD);
    const swing = generateIntegerByConstraint(BackgroundConstraint.HEIGHT);

    const startPosition = object.position.clone();
    const getPosition = createVectorCalculator({yRange: [START_ANIMATION_POSITION, Array.from(startPosition)]});

    const {calculateY: getBackgroundY} = createDifferenceCalculator(createSineCalculator({swing, period, y: Math.random()}));

    return new CompositeAnimation([
      new FrameAnimation({
        name: `foreground`,
        delay,
        duration,
        onProgress: easeOutExpo,
        onRenderFrame(state) {
          const {progress} = state;

          if (rig) {
            rig.setScale(progress);
            rig.setPosition(progress);
            rig.setRotation(progress);
            rig.invalidate();
            return;
          }

          if (isExclusiveAnimation) {
            onRenderFrame(state);
            return;
          }

          object.scale.set(progress, progress, progress);
          object.position.set(...getPosition(progress));
          onRenderFrame(state);
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
    defaultCameraPosition: DEFAULT_CAMERA_POSITION,
    scene,
    animation,
  };
};
