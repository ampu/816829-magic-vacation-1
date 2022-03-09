import * as THREE from 'three';

import {containSize} from 'helpers/document-helpers';
import {ScreenId, ScreenState, addScreenListener} from 'helpers/screen-helpers';
import HueRotationTextureMaterial from './materials/hue-rotation-texture-material';
import {SLIDES, addSlideChangeListener} from 'modules/slider';

const INTRO_TEXTURE_URL = `./img/scenes-textures/scene-0.png`;
const INTRO_TEXTURE_HUE_ROTATION = 0;
const INTRO_THEME_COLOR = `#5f458c`;

const PLANE_SIZE = [2048, 1024];

const initScene = ({
  canvas,
  width,
  height,
  fov = 90,
  near = 0.1,
  far = 510,
  clearColor = INTRO_THEME_COLOR,
}) => {
  [width, height] = containSize(PLANE_SIZE, [width, height]);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(new THREE.Color(clearColor));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  camera.position.z = far;

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

const createTexturePlane = (textureUrl, textureHueRotation) => {
  const geometry = new THREE.PlaneBufferGeometry(...PLANE_SIZE);
  const texture = new THREE.TextureLoader().load(textureUrl);
  const material = new HueRotationTextureMaterial(texture, textureHueRotation);
  return new THREE.Mesh(geometry, material);
};

export default () => {
  const animationScreen = document.querySelector(`.animation-screen`);
  const introTexturePlane = createTexturePlane(INTRO_TEXTURE_URL, INTRO_TEXTURE_HUE_ROTATION);
  const slideTexturePlanes = SLIDES.map(({textureUrl, textureHueRotation}) => createTexturePlane(textureUrl, textureHueRotation));

  const {renderer, scene, camera} = initScene({
    canvas: animationScreen.querySelector(`canvas`),
    width: animationScreen.clientWidth,
    height: animationScreen.clientHeight,
  });

  const state = {
    currentTexturePlane: introTexturePlane,
    currentSlide: SLIDES[0],
    currentSlideTexturePlane: slideTexturePlanes[0],
  };

  const renderTexturePlane = (texturePlane, themeColor) => {
    if (state.currentTexturePlane) {
      scene.remove(state.currentTexturePlane);
    }
    scene.add(texturePlane);
    renderer.setClearColor(new THREE.Color(themeColor));
    renderer.render(scene, camera);
    state.currentTexturePlane = texturePlane;
  };

  const onWindowResize = () => {
    resizeScene({
      renderer,
      scene,
      camera,
      width: animationScreen.clientWidth,
      height: animationScreen.clientHeight,
    });
  };

  window.addEventListener(`resize`, onWindowResize);

  addScreenListener(ScreenId.INTRO, {
    [ScreenState.ACTIVE]: () => {
      renderTexturePlane(introTexturePlane, INTRO_THEME_COLOR);
    },
  });

  addScreenListener(ScreenId.STORY, {
    [ScreenState.ACTIVE]: () => {
      renderTexturePlane(state.currentSlideTexturePlane, state.currentSlide.themeColor);
    },
  });

  addSlideChangeListener(({slideIndex, slide}) => {
    state.currentSlide = slide;
    state.currentSlideTexturePlane = slideTexturePlanes[slideIndex];
    renderTexturePlane(state.currentSlideTexturePlane, state.currentSlide.themeColor);
  });

  renderer.render(scene, camera);
};
