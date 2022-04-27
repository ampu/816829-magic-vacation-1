import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {containSize} from 'helpers/document-helpers';
import {StateStorage} from 'helpers/state-storage';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const ShadowsRequirement = {
  SCREEN_WIDTH: 1024,
  HARDWARE_CONCURRENCY: 2,
};

const PLANE_SIZE = [2048, 1024];

const CAMERA_CONFIG = {
  position: [0, 0, 0],
  lookAt: [0, 0, 0],
};

const AXIS_SIZE = 2000;
const AXIS_SEGMENTS = AXIS_SIZE / 100;

export class Infrastructure {
  constructor({
    container,
    canvas,
    cameraConfig = CAMERA_CONFIG,
    clearColor,
    onBeforeRender,
    onAfterRender,
  }) {
    this.container = container;
    this.canvas = canvas;
    const [width, height] = calculateRendererSize(container);
    this.renderer = createRenderer(canvas, width, height, clearColor);
    this.scene = createScene();

    this.cameraConfigStorage = new StateStorage(sessionStorage, `camera-config`);
    this.cameraConfig = this.cameraConfigStorage.getState(cameraConfig);
    this.camera = createCamera({...cameraConfig, width, height});
    this.scene.add(this.camera);
    setupCamera(this.camera, this.cameraConfig);
    this.orbit = resetOrbit(this.orbit, this.canvas, this.camera);

    this.shouldResize = false;
    window.addEventListener(`resize`, () => {
      this.shouldResize = true;
    });

    this.onBeforeRender = onBeforeRender;
    this.onAfterRender = onAfterRender;
    this.run = this.run.bind(this);
    this.setCameraConfig = this.setCameraConfig.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
  }

  run(performanceNow = performance.now()) {
    if (typeof tickFpsCounter !== `undefined`) {
      /* eslint-disable-next-line no-undef */
      tickFpsCounter(performanceNow);
    }
    if (this.shouldResize) {
      const [width, height] = calculateRendererSize(this.container);
      resizeInfrastructure(this.renderer, this.camera, width, height);
      this.shouldResize = false;
    }
    if (this.onBeforeRender) {
      this.onBeforeRender();
    }
    this.renderer.render(this.scene, this.camera);
    if (this.onAfterRender) {
      this.onAfterRender();
    }
    this.cameraConfigStorage.setState(this.cameraConfig);
    requestAnimationFrame(this.run);
  }

  setCameraConfig(cameraConfig) {
    this.cameraConfig = cameraConfig;
  }

  resetCamera() {
    setupCamera(this.camera, this.cameraConfig);
    // this.orbit = resetOrbit(this.orbit, this.canvas, this.camera);
  }
}

const calculateRendererSize = (container) => {
  return containSize(PLANE_SIZE, [container.clientWidth, container.clientHeight]);
};

const createRenderer = (canvas, width, height, clearColor = 0x000000) => {
  [width, height] = containSize(PLANE_SIZE, [width, height]);

  const parameters = {
    canvas,
    logarithmicDepthBuffer: true,
    antialias: true,
    powerPreference: `high-performance`,
  };

  const renderer = typeof WebGLDebugUtils !== `undefined`
    ? new THREE.WebGLRenderer({
      ...parameters,
      /* eslint-disable-next-line no-undef */
      context: WebGLDebugUtils.makeDebugContext(canvas.getContext(`webgl`)),
    })
    : new THREE.WebGLRenderer(parameters);

  renderer.shadowMap.enabled = window.innerWidth >= ShadowsRequirement.SCREEN_WIDTH
    && navigator.hardwareConcurrency >= ShadowsRequirement.HARDWARE_CONCURRENCY;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(clearColor));

  return renderer;
};

const createCamera = ({fov = 35, near = 0.1, far = 10000, width, height}) => {
  return new THREE.PerspectiveCamera(fov, width / height, near, far);
};

const setupCamera = (camera, {position, rotation, lookAt}) => {
  if (position) {
    camera.position.set(...position);
  }
  if (rotation) {
    rotateObjectInDegrees(camera, rotation);
  }
  if (lookAt && camera.parent) {
    camera.parent.updateWorldMatrix(true, false);
    const target = camera.parent.localToWorld(new THREE.Vector3(...lookAt));
    camera.lookAt(target);
  }
};

const createScene = () => {
  const scene = new THREE.Scene();

  scene.add(new THREE.AxesHelper(AXIS_SIZE));
  addGridHelpers(scene);

  return scene;
};

const resizeInfrastructure = (renderer, camera, width, height) => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

const resetOrbit = (orbit, canvas, camera) => {
  if (orbit) {
    orbit.dispose();
  }
  orbit = new OrbitControls(camera, canvas);
  orbit.target.set(0, 0, 0);
  orbit.update();
  return orbit;
};

const addGridHelpers = (scene) => {
  scene.add(new THREE.GridHelper(AXIS_SIZE, AXIS_SEGMENTS));

  const yGrid = new THREE.GridHelper(AXIS_SIZE, AXIS_SEGMENTS);
  yGrid.rotation.set(Math.PI / 2, 0, 0);
  scene.add(yGrid);

  const zGrid = new THREE.GridHelper(AXIS_SIZE, AXIS_SEGMENTS);
  zGrid.rotation.set(0, 0, Math.PI / 2);
  scene.add(zGrid);
};
