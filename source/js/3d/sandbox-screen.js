import * as THREE from 'three';

import {StateStorage} from 'helpers/state-storage';
import {addKeyboardListener, KeyboardKey} from 'helpers/keyboard-helpers';
import {getGUI} from '3d/helpers/gui-helpers';
import {Infrastructure} from '3d/helpers/infrastructure';
import {sleep} from 'helpers/document-helpers';

import {addDogScene} from '3d/scenes/dog-scene';
import {addPyramidScene} from '3d/scenes/pyramid-scene';
import {addCompassScene} from '3d/scenes/compass-scene';
import {addSonyaScene} from '3d/scenes/sonya-scene';
import {addKeyholeScene} from '3d/scenes/keyhole-scene';
import {createKeyholeHistoryRig} from './rigs/keyhole-history-rig';
import {Z_OFFSET} from '3d/objects/keyhole';

const SceneKey = {
  KEYHOLE: `keyhole`,
  DOG: `dog`,
  PYRAMID: `pyramid`,
  COMPASS: `compass`,
  SONYA: `sonya`,
};

const DEFAULT_SCENE_KEY = SceneKey.KEYHOLE;
const MIDDLE_SCENE_KEY = SceneKey.DOG;

const SCENE_KEYS = Object.values(SceneKey);

const HISTORY_CAMERA_RADIUS = 2550;
const HISTORY_CAMERA_HEIGHT = 800;
const HISTORY_CAMERA_RADIUS_XZ = Math.sqrt(HISTORY_CAMERA_RADIUS ** 2 - HISTORY_CAMERA_HEIGHT ** 2);
const HISTORY_CAMERA_POSITION = [Math.sqrt(HISTORY_CAMERA_RADIUS_XZ ** 2 / 2), HISTORY_CAMERA_HEIGHT, Math.sqrt(HISTORY_CAMERA_RADIUS_XZ ** 2 / 2)];
const HISTORY_CAMERA_LOOK = [0, 130, 0];

const BASE_ANIMATION_DURATION = 1000;

const HISTORY_CAMERA = {
  position: HISTORY_CAMERA_POSITION,
  look: HISTORY_CAMERA_LOOK,
};

const KEYHOLE_CAMERA = {
  position: [0, 0, 1000],
  look: [0, 0, -4000],
};

const SCENE_KEY_TO_PARAMETER = {
  [SceneKey.KEYHOLE]: {},
  [SceneKey.DOG]: {
    isHistory: true,
    historySceneIndex: 0,
  },
  [SceneKey.PYRAMID]: {
    isHistory: true,
    historySceneIndex: 1,
  },
  [SceneKey.COMPASS]: {
    isHistory: true,
    historySceneIndex: 2,
  },
  [SceneKey.SONYA]: {
    isHistory: true,
    historySceneIndex: 3,
  },
};

const currentSceneKeyStorage = new StateStorage(sessionStorage, `current-scene-key`);

const getSceneKeyByIndex = (index) => {
  return SCENE_KEYS[((index % SCENE_KEYS.length) + SCENE_KEYS.length) % SCENE_KEYS.length];
};

export default async () => {
  const {scene, camera, run, resetCamera} = new Infrastructure({
    container: document.querySelector(`.animation-screen`),
    canvas: document.querySelector(`.animation-screen canvas`),
    onBeforeRender() {
      scene.updateWorldMatrix(true, true);
      state.cameraRig.invalidate();
    },
  });

  const state = {
    sceneKey: undefined,
    sceneKeyToState: {},
    isPending: false,
    cameraRig: undefined,
  };

  const createPendingHelper = (shouldAdherePending) => {
    return {
      is() {
        return shouldAdherePending && state.isPending;
      },
      set(value) {
        if (shouldAdherePending) {
          state.isPending = value;
          if (value) {
            getGUI().show(false);
          } else {
            getGUI().show(true);
            for (const controller of getGUI().controllersRecursive()) {
              controller.updateDisplay();
            }
          }
        }
      },
    };
  };

  const setCurrentScene = async (sceneKey, shouldUpdateController = true, shouldAdherePending = true) => {
    const pending = createPendingHelper(shouldAdherePending);
    if (pending.is() || state.sceneKey === sceneKey) {
      return;
    }
    pending.set(true);
    const previousSceneKey = state.sceneKey;

    const startSceneParameter = SCENE_KEY_TO_PARAMETER[previousSceneKey];
    const endSceneParameter = SCENE_KEY_TO_PARAMETER[sceneKey];

    const hasMiddlePoint = !!(previousSceneKey !== MIDDLE_SCENE_KEY
      && sceneKey !== MIDDLE_SCENE_KEY
      && startSceneParameter
      && startSceneParameter.isHistory ^ endSceneParameter.isHistory);

    if (hasMiddlePoint) {
      await setCurrentScene(MIDDLE_SCENE_KEY, shouldUpdateController, false);
      await setCurrentScene(sceneKey, shouldUpdateController, false);
      pending.set(false);
      return;
    }

    if (startSceneParameter) {
      if (startSceneParameter.isHistory && endSceneParameter.isHistory) {
        state.cameraRig.startHistoryAnimation(endSceneParameter.historySceneIndex, BASE_ANIMATION_DURATION);
        await sleep(BASE_ANIMATION_DURATION);
      } else if (endSceneParameter.isHistory) {
        state.cameraRig.startKeyholeAnimation(false, 2 * BASE_ANIMATION_DURATION);
        await sleep(2 * BASE_ANIMATION_DURATION);
      } else {
        state.cameraRig.startKeyholeAnimation(true, 2 * BASE_ANIMATION_DURATION);
        await sleep(2 * BASE_ANIMATION_DURATION);
      }
    } else {
      const progress = endSceneParameter.isHistory ? 0 : 1;
      state.cameraRig.setRadiusProgress(progress);
      state.cameraRig.setHeightProgress(progress);
      state.cameraRig.setTargetLookProgress(progress);
      state.cameraRig.setHistorySceneIndex(endSceneParameter.historySceneIndex || 0);
    }

    state.sceneKey = sceneKey;
    currentSceneKeyStorage.setState(sceneKey);
    if (shouldUpdateController) {
      sceneController.updateDisplay();
    }
    pending.set(false);
  };

  await Promise.all([
    addKeyholeScene(scene).then((sceneState) => {
      state.sceneKeyToState[SceneKey.KEYHOLE] = sceneState;
    }),
    addDogScene(scene, 0 * Math.PI / 2).then((sceneState) => {
      state.sceneKeyToState[SceneKey.DOG] = sceneState;
    }),
    addPyramidScene(scene, 1 * Math.PI / 2).then((sceneState) => {
      state.sceneKeyToState[SceneKey.PYRAMID] = sceneState;
    }),
    addCompassScene(scene, 2 * Math.PI / 2).then((sceneState) => {
      state.sceneKeyToState[SceneKey.COMPASS] = sceneState;
    }),
    addSonyaScene(scene, 3 * Math.PI / 2).then((sceneState) => {
      state.sceneKeyToState[SceneKey.SONYA] = sceneState;
    }),
  ]);

  scene.updateWorldMatrix(true, true);

  const keyholeScene = state.sceneKeyToState[SceneKey.KEYHOLE].scene;
  const dogScene = state.sceneKeyToState[SceneKey.DOG].scene;

  camera.position.set(...HISTORY_CAMERA.position);
  window.camera = camera;

  state.cameraRig = createKeyholeHistoryRig(camera, {
    radiusRange: [
      dogScene.localToWorld(new THREE.Vector3(...HISTORY_CAMERA.position)).length(),
      keyholeScene.localToWorld(new THREE.Vector3(0, 0, Z_OFFSET)).length(),
      keyholeScene.localToWorld(new THREE.Vector3(...KEYHOLE_CAMERA.position)).length(),
    ],
    heightRange: [
      dogScene.localToWorld(new THREE.Vector3(...HISTORY_CAMERA.position)).y,
      keyholeScene.localToWorld(new THREE.Vector3(...KEYHOLE_CAMERA.position)).y,
    ],
    targetLookRange: [
      dogScene.localToWorld(new THREE.Vector3(...HISTORY_CAMERA.look)).toArray(),
      keyholeScene.localToWorld(new THREE.Vector3(...KEYHOLE_CAMERA.look)).toArray(),
    ],
  });

  await setCurrentScene(currentSceneKeyStorage.getState(DEFAULT_SCENE_KEY), false);

  const sceneController = getGUI(`Press &lt;TAB> to switch scene`).add({
    get scene() {
      return state.sceneKey;
    },
    set scene(value) {
      setCurrentScene(value, false);
    },
  }, `scene`, SCENE_KEYS);

  addKeyboardListener({
    [KeyboardKey.ESCAPE]: () => {
      resetCamera();
    },
    [KeyboardKey.TAB]: (evt) => {
      evt.preventDefault();
      const sceneIndex = SCENE_KEYS.indexOf(state.sceneKey) + (evt.shiftKey ? -1 : 1);
      setCurrentScene(getSceneKeyByIndex(sceneIndex), true);
    },
  });

  run();
};
