import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {ObjectName} from '3d/constants/object-name';
import {containSize} from 'helpers/document-helpers';
import {StateStorage} from 'helpers/state-storage';

import {addDirectionalLight, addHemisphereLight, addLightGroup, addPointLight1, addPointLight2} from './lights/lights';
import {addDogScene} from '3d/scenes/dog-scene';
import {getGUI} from '3d/helpers/gui-helpers';

const ShadowsRequirement = {
  SCREEN_WIDTH: 1024,
  HARDWARE_CONCURRENCY: 2,
};

const PLANE_SIZE = [2048, 1024];
const DEFAULT_CAMERA_POSITION = {x: Math.sqrt(2550 ** 2 / 2), y: 800, z: Math.sqrt(2550 ** 2 / 2)};
// const DEFAULT_CAMERA_POSITION = {x: 0, y: 0, z: 1000};

const cameraPositionStorage = new StateStorage(sessionStorage, `camera-position`);
const currentHistorySceneIndexStorage = new StateStorage(sessionStorage, `current-history-scene-index`);

const createScene = ({
  canvas,
  width,
  height,
  fov = 35,
  near = 0.1,
  far = 10000,
  clearColor = 0x000000,
}) => {
  [width, height] = containSize(PLANE_SIZE, [width, height]);

  const renderer = typeof WebGLDebugUtils !== `undefined`
    ? new THREE.WebGLRenderer({
      canvas,
      /* eslint-disable-next-line no-undef */
      context: WebGLDebugUtils.makeDebugContext(canvas.getContext(`webgl`)),
      logarithmicDepthBuffer: true,
      antialias: true,
      powerPreference: `high-performance`,
    })
    : new THREE.WebGLRenderer({
      canvas,
      logarithmicDepthBuffer: true,
      antialias: true,
      powerPreference: `high-performance`,
    });

  renderer.shadowMap.enabled = window.innerWidth >= ShadowsRequirement.SCREEN_WIDTH
    && navigator.hardwareConcurrency >= ShadowsRequirement.HARDWARE_CONCURRENCY;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(clearColor));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.position.copy(cameraPositionStorage.getState(DEFAULT_CAMERA_POSITION));
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AxesHelper(2000));

  scene.add(new THREE.GridHelper(2000));

  const yGrid = new THREE.GridHelper(2000);
  yGrid.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
  scene.add(yGrid);

  const zGrid = new THREE.GridHelper(2000);
  zGrid.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
  scene.add(zGrid);

  return {renderer, scene, camera};
};

const resizeScene = ({
  renderer,
  scene,
  camera,
  width,
  height,
}) => {
  [width, height] = containSize(PLANE_SIZE, [width, height]);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.render(scene, camera);
};

const addOrbit = (renderer, camera) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  return controls;
};

export default () => {
  const animationScreen = document.querySelector(`.animation-screen`);
  const canvas = animationScreen.querySelector(`canvas`);

  const {renderer, scene: mainScene, camera} = createScene({
    canvas,
    width: animationScreen.clientWidth,
    height: animationScreen.clientHeight,
  });

  let orbit = addOrbit(renderer, camera);
  let shouldResizeScene = false;

  const lightGroup = addLightGroup(mainScene, DEFAULT_CAMERA_POSITION);
  addHemisphereLight(mainScene, lightGroup, DEFAULT_CAMERA_POSITION);
  addDirectionalLight(mainScene, lightGroup, DEFAULT_CAMERA_POSITION);
  addPointLight1(mainScene, lightGroup);
  addPointLight2(mainScene, lightGroup);

  let currentHistorySceneIndex = currentHistorySceneIndexStorage.getState(0);
  const setCurrentHistorySceneIndex = (value) => {
    currentHistorySceneIndex = (value + 4) % 4;
    history.rotation.y = -currentHistorySceneIndex * Math.PI / 2;
    // sceneController.updateDisplay();
    currentHistorySceneIndexStorage.setState(currentHistorySceneIndex);
  };

  const history = new THREE.Group();
  history.name = ObjectName.HISTORY;
  history.rotation.y = -currentHistorySceneIndex * Math.PI / 2;

  mainScene.add(history);
  addDogScene(history, 0 * Math.PI / 2).then(({animation}) => animation.start());
  // addPyramidScene(history, 1 * Math.PI / 2);
  // addCompassScene(history, 2 * Math.PI / 2);
  // addSonyaScene(history, 3 * Math.PI / 2);
  // addKeyholeScene(mainScene).then(({animation}) => animation.start());

  // const gui = getGUI(`Press &lt;TAB> to switch scene`);
  // const sceneController = gui.add({
  //   get scene() {
  //     return currentHistorySceneIndex;
  //   },
  //   set scene(value) {
  //     setCurrentHistorySceneIndex(value);
  //   },
  // }, `scene`, {
  //   [`Dog`]: 0,
  //   [`Pyramid`]: 1,
  //   [`Compass`]: 2,
  //   [`Sonya`]: 3,
  // });

  window.addEventListener(`resize`, () => {
    shouldResizeScene = true;
  });

  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      camera.position.copy(DEFAULT_CAMERA_POSITION);
      camera.rotation.set(0, 0, 0);
      setCurrentHistorySceneIndex(0);

      orbit.dispose();
      orbit = addOrbit(renderer, camera);

      getGUI().controllersRecursive().forEach((controller) => {
        controller.reset();
      });
      return;
    }
    if (evt.key === `Tab`) {
      evt.preventDefault();
      setCurrentHistorySceneIndex(currentHistorySceneIndex + (evt.shiftKey ? -1 : 1));
      return;
    }
  });

  const render = (performanceNow) => {
    if (typeof tickFpsCounter !== `undefined`) {
      /* eslint-disable-next-line no-undef */
      tickFpsCounter(performanceNow);
    }
    if (shouldResizeScene) {
      resizeScene({
        renderer,
        scene: mainScene,
        camera,
        width: animationScreen.clientWidth,
        height: animationScreen.clientHeight,
      });
      shouldResizeScene = false;
    }
    cameraPositionStorage.setState(camera.position);
    renderer.render(mainScene, camera);
    requestAnimationFrame(render);
  };
  render();
};
