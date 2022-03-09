import * as THREE from 'three';
import debounce from 'lodash/debounce';

import {containSize} from 'helpers/document-helpers';
import {ScreenId, ScreenState, addScreenListener} from 'helpers/screen-helpers';
import CustomMaterial from './materials/custom-material';
import TextureMaterial from './materials/texture-material';
import {SLIDES, addSlideChangeListener} from 'modules/slider';

const INTRO_TEXTURE_URL = `./img/scenes-textures/scene-0.png`;
const INTRO_TEXTURE_HUE_ROTATION = 0;
const INTRO_THEME_COLOR = `#5f458c`;

const PLANE_SIZE = [2048, 1024];
const PLANE_ASPECT = [PLANE_SIZE[0] / PLANE_SIZE[1], 1];
const FPS_INTERVAL = 1000 / 60;

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

  const renderer = typeof WebGLDebugUtils !== `undefined`
    ? new THREE.WebGLRenderer({
      canvas,
      /* eslint-disable-next-line no-undef */
      context: WebGLDebugUtils.makeDebugContext(canvas.getContext(`webgl`)),
      alpha: true,
    })
    : new THREE.WebGLRenderer({
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

const createTexturePlane = (textureUrl, hueRotation, isCustom) => {
  const geometry = new THREE.PlaneBufferGeometry(...PLANE_SIZE);

  const texture = new THREE.TextureLoader().load(textureUrl);

  const material = isCustom
    ? new CustomMaterial({
      map: texture,
      aspect: PLANE_ASPECT,
      hueRotation,
      bubbles: [
        new THREE.Vector3(0, 0, 0.1),
        new THREE.Vector3(0, 0, 0.066),
        new THREE.Vector3(0, 0, 0.033),
      ],
    })
    : new TextureMaterial(texture);

  return new THREE.Mesh(geometry, material);
};

export default () => {
  const animationScreen = document.querySelector(`.animation-screen`);
  const canvas = animationScreen.querySelector(`canvas`);
  const introTexturePlane = createTexturePlane(INTRO_TEXTURE_URL, INTRO_TEXTURE_HUE_ROTATION, false);
  const slideTexturePlanes = SLIDES.map(({textureUrl, textureHueRotation, isCustom}) => createTexturePlane(textureUrl, textureHueRotation, isCustom));

  const {renderer, scene, camera} = initScene({
    canvas,
    width: animationScreen.clientWidth,
    height: animationScreen.clientHeight,
  });

  const state = {
    currentTexturePlane: introTexturePlane,
    currentSlide: SLIDES[0],
    currentSlideTexturePlane: slideTexturePlanes[0],
    mouse: [0, 0],
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

  const render = debounce(() => {
    const bubbles = state.currentTexturePlane.material.uniforms.bubbles;
    if (bubbles) {
      bubbles.value[0]
        .setX(state.mouse[0])
        .setY(state.mouse[1] + 0.25);

      bubbles.value[1]
        .setX(state.mouse[0] - 0.1)
        .setY(state.mouse[1]);

      bubbles.value[2]
        .setX(state.mouse[0] + 0.1)
        .setY(state.mouse[1] - 0.25);
    }
    renderer.render(scene, camera);
  }, FPS_INTERVAL, {leading: false, trailing: true});

  const onWindowResize = () => {
    resizeScene({
      renderer,
      scene,
      camera,
      width: animationScreen.clientWidth,
      height: animationScreen.clientHeight,
    });
  };

  const onDocumentMouseMove = (evt) => {
    state.mouse = [
      (evt.x - canvas.offsetLeft) / canvas.offsetWidth,
      1 - (evt.y - canvas.offsetTop) / canvas.offsetHeight,
    ];
    render();
  };

  window.addEventListener(`resize`, onWindowResize);
  document.addEventListener(`mousemove`, onDocumentMouseMove);

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
