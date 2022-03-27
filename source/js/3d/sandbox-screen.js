import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {containSize} from 'helpers/document-helpers';
import {StateStorage} from "../helpers/state-storage";

import {addDirectionalLight, addHemisphereLight, addLightGroup, addPointLight1, addPointLight2} from './lights/lights';

import {addPyramid} from './objects/pyramid';
import {addSaturn1, addSaturn4} from './objects/saturn';
import {addCarpet1, addCarpet2} from './objects/carpet';
import {addRoad} from './objects/road';
import {addLamppost} from './objects/lamppost';
import {addSnowman} from './objects/snowman';
import {addBigLeaf, addSmallLeaf} from './objects/leaf';
import {addFlamingo} from './objects/flamingo';
import {addSnowflake} from './objects/snowflake';
import {addQuestion} from './objects/question';
import {addKeyhole} from './objects/keyhole';

const PLANE_SIZE = [2048, 1024];
const DEFAULT_CAMERA_POSITION = {x: 1500, y: 1500, z: 1500};

const cameraPositionStorage = new StateStorage(sessionStorage, `camera-position`);

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
      powerPreference: `high-performance`,
    })
    : new THREE.WebGLRenderer({
      canvas,
      logarithmicDepthBuffer: true,
      powerPreference: `high-performance`,
    });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(clearColor));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.position.copy(cameraPositionStorage.getState(DEFAULT_CAMERA_POSITION));
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AxesHelper(300));
  scene.add(new THREE.GridHelper(2000));

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

  const {renderer, scene, camera} = createScene({
    canvas,
    width: animationScreen.clientWidth,
    height: animationScreen.clientHeight,
  });

  let orbit = addOrbit(renderer, camera);

  const lightGroup = addLightGroup(scene, DEFAULT_CAMERA_POSITION);
  addHemisphereLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addDirectionalLight(scene, lightGroup, DEFAULT_CAMERA_POSITION);
  addPointLight1(scene, lightGroup);
  addPointLight2(scene, lightGroup);

  window.addEventListener(`resize`, () => {
    resizeScene({
      renderer,
      scene,
      camera,
      width: animationScreen.clientWidth,
      height: animationScreen.clientHeight,
    });
  });

  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      camera.position.copy(DEFAULT_CAMERA_POSITION);
      orbit.dispose();
      orbit = addOrbit(renderer, camera);
    }
  });

  addCarpet1(scene);
  addCarpet2(scene);
  addRoad(scene);

  addSaturn1(scene);
  addSaturn4(scene);
  addPyramid(scene);
  addLamppost(scene);
  addSnowman(scene);

  addSmallLeaf(scene);
  addBigLeaf(scene);
  addFlamingo(scene);
  addSnowflake(scene);
  addQuestion(scene);
  addKeyhole(scene);

  const render = (performanceNow) => {
    if (typeof tickFpsCounter !== `undefined`) {
      /* eslint-disable-next-line no-undef */
      tickFpsCounter(performanceNow);
    }
    cameraPositionStorage.setState(camera.position);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
};
