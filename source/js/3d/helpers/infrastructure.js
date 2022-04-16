import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {containSize} from 'helpers/document-helpers';
import {getGUI} from '3d/helpers/gui-helpers';
import {StateStorage} from 'helpers/state-storage';

const ShadowsRequirement = {
  SCREEN_WIDTH: 1024,
  HARDWARE_CONCURRENCY: 2,
};

const PLANE_SIZE = [2048, 1024];

const CAMERA_CONFIG = {
  fov: 35,
  near: 0.1,
  far: 10000,
  position: {x: 0, y: 0, z: 1000},
};

const AXIS_SIZE = 2000;
const AXIS_SEGMENTS = AXIS_SIZE / 100;

export class Infrastructure {
  constructor({
    container,
    canvas,
    cameraConfig = CAMERA_CONFIG,
    clearColor,
  }) {
    const [width, height] = calculateRendererSize(container);

    this.container = container;
    this.cameraPositionStorage = new StateStorage(sessionStorage, `camera-position`);
    this.defaultCameraPosition = this.cameraPositionStorage.getState(cameraConfig.position);
    this.renderer = createRenderer(canvas, width, height, clearColor);
    this.camera = createCamera({...cameraConfig, position: this.defaultCameraPosition, width, height});
    this.scene = createScene(canvas, this.camera);
    this.orbit = addOrbit(canvas, this.camera);

    this.shouldResize = false;
    window.addEventListener(`resize`, () => {
      this.shouldResize = true;
    });

    this.run = this.run.bind(this);
    this.setDefaultCameraPosition = this.setDefaultCameraPosition.bind(this);
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
    this.cameraPositionStorage.setState(this.camera.position);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
  }

  setDefaultCameraPosition(defaultCameraPosition) {
    this.defaultCameraPosition = defaultCameraPosition;
  }

  resetCamera() {
    this.orbit = resetCamera(this.renderer.domElement, this.camera, this.defaultCameraPosition, this.orbit);
  }
}

const calculateRendererSize = (container) => {
  return containSize(PLANE_SIZE, [container.clientWidth, container.clientHeight]);
};

const createRenderer = (canvas, width, height, clearColor = 0x000000) => {
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

  return renderer;
};

const createCamera = ({fov, near, far, position, width, height}) => {
  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.lookAt(0, 0, 0);
  camera.position.copy(position);
  return camera;
};

const resetCamera = (canvas, camera, cameraPosition, orbit) => {
  camera.position.copy(cameraPosition);
  camera.rotation.set(0, 0, 0);

  getGUI().controllersRecursive().forEach((controller) => {
    controller.reset();
  });

  orbit.dispose();
  return addOrbit(canvas, camera);
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

const addOrbit = (canvas, camera) => {
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
  return controls;
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
