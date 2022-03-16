import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {containSize} from 'helpers/document-helpers';

const PLANE_SIZE = [2048, 1024];
const CAMERA_POSITION = [0, 0, 750];

const createScene = ({
  canvas,
  width,
  height,
  fov = 35,
  near = 0.1,
  far = 5000,
  clearColor = 0x000000,
}) => {
  [width, height] = containSize(PLANE_SIZE, [width, height]);

  const renderer = typeof WebGLDebugUtils !== `undefined`
    ? new THREE.WebGLRenderer({
      canvas,
      /* eslint-disable-next-line no-undef */
      context: WebGLDebugUtils.makeDebugContext(canvas.getContext(`webgl`)),
      alpha: true,
      antialias: false,
    })
    : new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(clearColor));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.position.set(...CAMERA_POSITION);
  camera.lookAt(0, 0, 0);

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

const addObject = (parent) => {
  const geometry = new THREE.BoxGeometry(200, 200, 200);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffaaaa,
  });
  const object = new THREE.Mesh(geometry, material);
  parent.add(object);
  return object;
};

const addOrbitControls = (renderer, camera) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
};

const addLightGroup = (parent) => {
  const group = new THREE.Object3D();
  group.position.set(...CAMERA_POSITION);
  parent.add(group);
  return group;
};

const addDirectionalLight = (scene, parent) => {
  const [x, y, z] = CAMERA_POSITION;

  const light = new THREE.DirectionalLight(`rgb(255, 255, 255)`, 0.84);
  light.target.position.set(-x, -y, -z);
  light.target.position.y -= z * Math.tan(THREE.MathUtils.degToRad(15));
  light.target.updateMatrixWorld();

  parent.add(light);
  parent.add(light.target);

  const helper = new THREE.DirectionalLightHelper(light, 50);
  scene.add(helper);

  return light;
};

const addPointLight1 = (scene, parent) => {
  const light = new THREE.PointLight(`rgb(246, 242, 255)`, 0.6, 1975, 2.0);
  light.position.x -= 785;
  light.position.y -= 350;
  light.position.z -= 710;
  parent.add(light);

  const helper = new THREE.PointLightHelper(light, 50);
  scene.add(helper);

  return light;
};

const addPointLight2 = (scene, parent) => {
  const light = new THREE.PointLight(`rgb(245, 254, 255)`, 0.95, 1975, 2.0);
  light.position.x += 730;
  light.position.y += 800;
  light.position.z -= 985;
  parent.add(light);

  const helper = new THREE.PointLightHelper(light, 50);
  scene.add(helper);

  return light;
};

export default () => {
  const animationScreen = document.querySelector(`.animation-screen`);
  const canvas = animationScreen.querySelector(`canvas`);

  const {renderer, scene, camera} = createScene({
    canvas,
    width: animationScreen.clientWidth,
    height: animationScreen.clientHeight,
  });

  addOrbitControls(renderer, camera);

  addObject(scene);

  const lightGroup = addLightGroup(scene);
  addDirectionalLight(scene, lightGroup);
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

  const render = (performanceNow) => {
    if (typeof tickFpsCounter !== `undefined`) {
      /* eslint-disable-next-line no-undef */
      tickFpsCounter(performanceNow);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
};
