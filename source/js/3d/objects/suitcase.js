import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/gltfloader';

import {getGUI} from '3d/helpers/gui-helpers';
import {rotateObjectInDegrees, scaleObjectToFitHeight, setPolarPosition2} from '3d/helpers/object-helpers';
import {ObjectName} from '3d/constants/object-name';
import {wrapObject} from '3d/helpers/object-helpers';

import {CompositeAnimation} from 'helpers/composite-animation';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator} from 'helpers/calculator';
import {easeIn, easeInOut, easeOut} from 'helpers/easings';

const SUITCASE_URL = `./3d/module-6/scene-0-objects/suitcase.gltf`;

const KEYHOLE_SUITCASE = {
  height: 102,
  position: [-60, -125, 0],
  rotation: [20, -140, 15, `XYZ`]
};

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
  object.name = ObjectName.SUITCASE;
  scaleObjectToFitHeight(object, height);

  return object;
};

export const addKeyholeSuitcase = async (parent) => {
  const object = await addSuitcase(parent, KEYHOLE_SUITCASE);
  rotateObjectInDegrees(object, KEYHOLE_SUITCASE.rotation);

  const wrapper = wrapObject(object);
  wrapper.position.set(...KEYHOLE_SUITCASE.position);

  parent.add(wrapper);
  return {
    object: wrapper,
    onRenderFrame() {
    },
  };
};

export const addHistorySuitcase = async (parent, title) => {
  const object = await addSuitcase(parent, HISTORY_SUITCASE);

  const wrapper = wrapObject(object);
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
  const getScaleY = HISTORY_SUITCASE.scales.slice(1).map((_, i) => {
    return createCalculator({yRange: [1 + HISTORY_SUITCASE.scales[i], 1 + HISTORY_SUITCASE.scales[i + 1]]});
  });
  const getScaleXZ = HISTORY_SUITCASE.scales.slice(1).map((_, i) => {
    return createCalculator({yRange: [1 - HISTORY_SUITCASE.scales[i] / 2, 1 - HISTORY_SUITCASE.scales[i + 1] / 2]});
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
