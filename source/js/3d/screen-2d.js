import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';

import {SLIDES, addSlideChangeListener} from 'modules/slider';
import {ScreenId, ScreenState, addScreenListener} from 'helpers/screen-helpers';

import BubblesMaterial from '3d/materials/bubbles-material';
import TextureMaterial from '3d/materials/texture-material';
import {Infrastructure} from '3d/helpers/infrastructure';
import {createBubblesAnimation} from '3d/animations/bubbles-animation';

const INTRO_TEXTURE_URL = `./img/scenes-textures/scene-0.png`;
const INTRO_TEXTURE_HUE_ROTATION = 0;
const INTRO_THEME_COLOR = `#5f458c`;

const PLANE_SIZE = [2048, 1024];
const PLANE_ASPECT = [PLANE_SIZE[0] / PLANE_SIZE[1], 1];

const createTexturePlane = (textureUrl) => {
  const geometry = new THREE.PlaneBufferGeometry(...PLANE_SIZE);
  const texture = new THREE.TextureLoader().load(textureUrl);
  const material = new TextureMaterial(texture);
  return new THREE.Mesh(geometry, material);
};

export default () => {
  const introTexturePlane = createTexturePlane(INTRO_TEXTURE_URL, INTRO_TEXTURE_HUE_ROTATION, false);
  const slideTexturePlanes = SLIDES.map(({textureUrl}) => createTexturePlane(textureUrl));

  const {renderer, scene, camera} = new Infrastructure({
    container: document.querySelector(`.animation-screen`),
    canvas: document.querySelector(`.animation-screen canvas`),
    cameraConfig: {
      fov: 90,
      near: 0.1,
      far: 520,
      position: [0, 0, 510],
      lookAt: [0, 0, 0],
    },
    clearColor: INTRO_THEME_COLOR,
  });

  const state = {
    currentTexturePlane: introTexturePlane,
    currentSlide: SLIDES[0],
    currentSlideTexturePlane: slideTexturePlanes[0],
  };

  const bubblesMaterial = new BubblesMaterial({aspect: PLANE_ASPECT});
  const bubblesAnimation = createBubblesAnimation({
    bubblesUniform: bubblesMaterial.uniforms.bubbles,
    hueRotationUniform: bubblesMaterial.uniforms.hueRotation,
    onDoRenderFrame() {
      composer.render();
    },
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new ShaderPass(bubblesMaterial, `map`));

  const startRenderingTexturePlane = (texturePlane, themeColor, currentSlide) => {
    if (state.currentTexturePlane) {
      scene.remove(state.currentTexturePlane);
    }
    scene.add(texturePlane);
    state.currentTexturePlane = texturePlane;

    renderer.setClearColor(new THREE.Color(themeColor));

    if (currentSlide && currentSlide.withBubbles) {
      bubblesAnimation.start();
      return;
    }
    composer.render();
  };

  addScreenListener(ScreenId.INTRO, {
    [ScreenState.ACTIVE]: () => {
      startRenderingTexturePlane(introTexturePlane, INTRO_THEME_COLOR, null);
    },
  });

  addScreenListener(ScreenId.STORY, {
    [ScreenState.ACTIVE]: () => {
      startRenderingTexturePlane(state.currentSlideTexturePlane, state.currentSlide.themeColor, state.currentSlide);
    },
    [ScreenState.HIDDEN]: () => {
      bubblesAnimation.stop();
      bubblesMaterial.uniforms.hueRotation.value = 0;
    },
  });

  addSlideChangeListener(({slideIndex, slide}) => {
    state.currentSlide = slide;
    state.currentSlideTexturePlane = slideTexturePlanes[slideIndex];
    if (state.currentTexturePlane !== introTexturePlane) {
      startRenderingTexturePlane(state.currentSlideTexturePlane, state.currentSlide.themeColor, state.currentSlide);
    }
  });
};
