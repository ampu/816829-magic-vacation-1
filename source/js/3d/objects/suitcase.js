import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';

import {addRotationGUI, getGUI} from '3d/helpers/gui-helpers';
import {centerObjectTransformOrigin, rotateObjectInDegrees, scaleObjectToFitHeight, setPolarPosition2} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';
import {wrapObject} from '3d/helpers/object-helpers';

import {START_ANIMATION_POSITION} from '3d/objects/keyhole';
import {CompositeAnimation} from 'helpers/composite-animation';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator, createRotationCalculator, createSineCalculator} from 'helpers/calculator';
import {easeIn, easeInOut, easeLinear, easeOut} from 'helpers/easings';

const SUITCASE_URL = `./3d/module-6/scene-0-objects/suitcase.gltf`;

const HISTORY_SUITCASE = {
  height: 220,
  polarRadius: 830,
  startAngle: 20,
  scales: [+0.1, 0, -0.05, +0.05, 0],
  animationHeightRatio: 3 / 4,
  baseDelay: 1000,
  baseDuration: 150,
};

const loadSuitcase = () => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SUITCASE_URL, resolve, null, reject);
  });
};

const addSuitcase = async (parent, {height}) => {
  const gltf = await loadSuitcase();

  /** @param {Group} object */
  const object = gltf.scene;
  scaleObjectToFitHeight(object, height);

  return object;
};

export const addKeyholeSuitcase = async (parent) => {
  const KEYHOLE_SUITCASE = {
    height: 102,
    position: {
      to: [-45, -75, 0],
      yCalculator: {
        x: 0.2,
        swing: 125,
        period: 2,
      }
    },
    rotation: {
      from: [-120, -120, -60],
      middle: [-120, -60, -60],
      to: [30, -145, 15],
    },
  };

  const {
    position: {
      to: [toX, toY, toZ],
      yCalculator,
    },
    rotation,
  } = KEYHOLE_SUITCASE;

  const rotate = createRotationCalculator({yRange: [rotation.from, rotation.to], onProgress: easeLinear});

  const onRenderFrame = ({progress}) => {
    object.rotation.set(...rotate(progress));

    wrapper.scale.set(progress, progress, progress);

    wrapper.position.x = getX(progress);
    wrapper.position.y = fromY + getY(progress);
    wrapper.position.z = getZ(progress);

    for (const controller of rotationGUI.controllersRecursive()) {
      controller.updateDisplay();
    }
  };

  const [fromX, fromY, fromZ] = START_ANIMATION_POSITION;

  const object = await addSuitcase(parent, KEYHOLE_SUITCASE);
  centerObjectTransformOrigin(object, [`y`]);
  rotateObjectInDegrees(object, rotation.from);

  const folder = getGUI().addFolder(`suitcase`);
  const rotationGUI = addRotationGUI(folder, object.rotation);

  const wrapper = wrapObject(object);
  wrapper.name = ObjectName.SUITCASE;

  wrapper.position.set(toX, toY, toZ);
  const getX = createCalculator({yRange: [fromX, toX]});
  const doGetY = createSineCalculator(yCalculator).calculateY;
  const getY = (progress) => fromY + doGetY(progress) - doGetY(0);
  const getZ = createCalculator({yRange: [fromZ, toZ]});

  parent.add(wrapper);
  return {
    object: wrapper,
    isExclusiveAnimation: true,
    onRenderFrame,
  };
};

export const addHistorySuitcase = async (parent, title) => {
  const object = await addSuitcase(parent, HISTORY_SUITCASE);

  const wrapper = wrapObject(object);
  object.name = ObjectName.SUITCASE;
  setPolarPosition2(object, HISTORY_SUITCASE.polarRadius, HISTORY_SUITCASE.startAngle, `z`, `x`);

  const folder = getGUI().addFolder(title);
  folder.add({
    get angle() {
      return Math.round(THREE.MathUtils.radToDeg(object.rotation.y));
    },
    set angle(value) {
      setPolarPosition2(object, HISTORY_SUITCASE.polarRadius, value, `z`, `x`);
    },
  }, `angle`, -360, 360, 1);

  const getY = createCalculator({yRange: [HISTORY_SUITCASE.height * HISTORY_SUITCASE.animationHeightRatio, 0]});
  const [getScaleXZ, getScaleY] = HISTORY_SUITCASE.scales.slice(1).map((_, i) => {
    return [
      createCalculator({yRange: [1 - HISTORY_SUITCASE.scales[i] / 2, 1 - HISTORY_SUITCASE.scales[i + 1] / 2]}),
      createCalculator({yRange: [1 + HISTORY_SUITCASE.scales[i], 1 + HISTORY_SUITCASE.scales[i + 1]]}),
    ];
  });

  parent.add(wrapper);
  return {
    object: wrapper,
    animation: new CompositeAnimation([
      new FrameAnimation({
        delay: HISTORY_SUITCASE.baseDelay,
        duration: HISTORY_SUITCASE.baseDuration * 2,
        onProgress: easeIn,
        onRenderFrame({progress}) {
          object.position.y = getY(progress);
          object.scale.set(getScaleXZ[0](progress), getScaleY[0](progress), getScaleXZ[0](progress));
        },
      }),
      ...Array.from({length: 3}, (_, i) => {
        return new FrameAnimation({
          shouldPreloadFirstFrame: false,
          delay: HISTORY_SUITCASE.baseDelay + HISTORY_SUITCASE.baseDuration * (i + 2),
          duration: HISTORY_SUITCASE.baseDuration,
          onProgress: i === 0 ? easeOut : easeInOut,
          onRenderFrame({progress}) {
            object.scale.set(getScaleXZ[i + 1](progress), getScaleY[i + 1](progress), getScaleXZ[i + 1](progress));
          },
        });
      }),
    ]),
  };
};
