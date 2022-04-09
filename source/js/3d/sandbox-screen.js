import * as THREE from 'three';

import {ObjectName} from '3d/constants/object-name';
import {StateStorage} from 'helpers/state-storage';
import {getGUI} from '3d/helpers/gui-helpers';

import {Infrastructure} from '3d/helpers/infrastructure';
import {addDirectionalLight, addHemisphereLight, addLightGroup, addPointLight1, addPointLight2} from './lights/lights';
// import {addDogScene} from '3d/scenes/dog-scene';
// import {addPyramidScene} from '3d/scenes/pyramid-scene';
// import {addCompassScene} from '3d/scenes/compass-scene';
// import {addSonyaScene} from '3d/scenes/sonya-scene';
import {addKeyholeScene} from '3d/scenes/keyhole-scene';

const DEFAULT_CAMERA_POSITION = {x: Math.sqrt(2550 ** 2 / 2), y: 800, z: Math.sqrt(2550 ** 2 / 2)};

const currentHistorySceneIndexStorage = new StateStorage(sessionStorage, `current-history-scene-index`);

export default () => {
  const {scene, run, setDefaultCameraPosition, resetCamera} = new Infrastructure({
    container: document.querySelector(`.animation-screen`),
    canvas: document.querySelector(`.animation-screen canvas`),
  });

  resetCamera();

  const lightGroup = addLightGroup(scene, DEFAULT_CAMERA_POSITION);
  addHemisphereLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addDirectionalLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addPointLight1(scene, lightGroup);
  addPointLight2(scene, lightGroup);

  let currentHistorySceneIndex = currentHistorySceneIndexStorage.getState(0);
  const setCurrentHistorySceneIndex = (value) => {
    currentHistorySceneIndex = (value + 4) % 4;
    history.rotation.y = -currentHistorySceneIndex * Math.PI / 2;
    sceneController.updateDisplay();
    currentHistorySceneIndexStorage.setState(currentHistorySceneIndex);
  };

  const history = new THREE.Group();
  history.name = ObjectName.HISTORY;
  history.rotation.y = -currentHistorySceneIndex * Math.PI / 2;

  // addDogScene(history, 0 * Math.PI / 2).then(({animation}) => animation.start());
  // addPyramidScene(history, 1 * Math.PI / 2).then(({animation}) => animation.start());
  // addCompassScene(history, 2 * Math.PI / 2).then(({animation}) => animation.start());
  // addSonyaScene(history, 3 * Math.PI / 2).then(({animation}) => animation.start());

  scene.add(history);

  addKeyholeScene(scene)
    .then(({defaultCameraPosition, animation}) => {
      setDefaultCameraPosition(defaultCameraPosition);
      animation.start();
    });

  const sceneController = getGUI(`Press &lt;TAB> to switch scene`).add({
    get scene() {
      return currentHistorySceneIndex;
    },
    set scene(value) {
      setCurrentHistorySceneIndex(value);
    },
  }, `scene`, {
    [`Dog`]: 0,
    [`Pyramid`]: 1,
    [`Compass`]: 2,
    [`Sonya`]: 3,
  });

  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      resetCamera();
      return;
    }
    if (evt.key === `Tab`) {
      evt.preventDefault();
      setCurrentHistorySceneIndex(currentHistorySceneIndex + (evt.shiftKey ? -1 : 1));
      return;
    }
  });

  run();
};
