import * as THREE from 'three';

import {ScreenId, ScreenState, addScreenListener} from 'helpers/screen-helpers';
import CustomMaterial from './materials/custom-material';
import TextureMaterial from './materials/texture-material';
import {SLIDES, addSlideChangeListener} from 'modules/slider';
import {FrameAnimation, calculateIteration} from 'helpers/frame-animation';
import {NamedCalculator, createCalculator, createFadingSineCalculator} from 'helpers/calculator';
import {Infrastructure} from '3d/helpers/infrastructure';

const INTRO_TEXTURE_URL = `./img/scenes-textures/scene-0.png`;
const INTRO_TEXTURE_HUE_ROTATION = 0;
const INTRO_THEME_COLOR = `#5f458c`;

const PLANE_SIZE = [2048, 1024];
const PLANE_ASPECT = [PLANE_SIZE[0] / PLANE_SIZE[1], 1];
const CUSTOM_ANIMATION_FREQUENCY = 300;

const Bubble = {
  FIRST: {
    radius: 0.1,
    delay: 0,
  },
  SECOND: {
    radius: 0.066,
    delay: 500,
  },
  THIRD: {
    radius: 0.033,
    delay: 1000,
  },
};

const createTexturePlane = (textureUrl, isCustom) => {
  const geometry = new THREE.PlaneBufferGeometry(...PLANE_SIZE);

  const texture = new THREE.TextureLoader().load(textureUrl);

  const material = isCustom
    ? new CustomMaterial({
      map: texture,
      aspect: PLANE_ASPECT,
      hueRotation: 0,
      bubbles: [
        new THREE.Vector3(0, 0, Bubble.FIRST.radius),
        new THREE.Vector3(0, 0, Bubble.SECOND.radius),
        new THREE.Vector3(0, 0, Bubble.THIRD.radius),
      ],
    })
    : new TextureMaterial(texture);

  return new THREE.Mesh(geometry, material);
};

export default () => {
  const introTexturePlane = createTexturePlane(INTRO_TEXTURE_URL, INTRO_TEXTURE_HUE_ROTATION, false);
  const slideTexturePlanes = SLIDES.map(({textureUrl, isCustom}) => createTexturePlane(textureUrl, isCustom));

  const {renderer, scene, camera} = new Infrastructure({
    container: document.querySelector(`.animation-screen`),
    canvas: document.querySelector(`.animation-screen canvas`),
    cameraConfig: {
      fov: 90,
      near: 0.1,
      far: 510,
      position: {x: 0, y: 0, z: 510},
    },
    clearColor: INTRO_THEME_COLOR,
  });

  const state = {
    currentTexturePlane: introTexturePlane,
    currentSlide: SLIDES[0],
    currentSlideTexturePlane: slideTexturePlanes[0],
  };

  const bubbleCalculators = [
    {
      getX: createFadingSineCalculator({x: 2 / 3, y: 0.4, tRatio: 3, height: 0.2}).calculateY,
      getY: createCalculator({
        xRange: [Bubble.FIRST.delay, Bubble.FIRST.delay + 1800],
        yRange: [0 - Bubble.FIRST.radius, 1 + Bubble.FIRST.radius],
      }),
    },
    {
      getX: createFadingSineCalculator({x: 1 / 3, y: 0.25, tRatio: 3, height: 0.1}).calculateY,
      getY: createCalculator({
        xRange: [Bubble.SECOND.delay, Bubble.SECOND.delay + 1800],
        yRange: [0 - Bubble.SECOND.radius, 1 + Bubble.SECOND.radius],
      }),
    },
    {
      getX: createFadingSineCalculator({x: 0, y: 0.48, tRatio: 3, height: 0.05}).calculateY,
      getY: createCalculator({
        xRange: [Bubble.THIRD.delay, Bubble.THIRD.delay + 1800],
        yRange: [0 - Bubble.THIRD.radius, 1 + Bubble.THIRD.radius],
      }),
    },
  ];

  let hueRotationCalculator = null;
  const customSlideAnimation = new FrameAnimation({
    delay: 500,
    duration: 1800 + Bubble.THIRD.delay,
    onRenderFrame({progress, elapsed}) {
      if (typeof tickFpsCounter !== `undefined`) {
        /* eslint-disable-next-line no-undef */
        tickFpsCounter(elapsed);
      }

      const slide = state.currentSlide;
      const material = state.currentSlideTexturePlane.material;
      const bubblesUniform = material.uniforms.bubbles;
      const hueRotationUniform = material.uniforms.hueRotation;

      const iteration = calculateIteration(elapsed, CUSTOM_ANIMATION_FREQUENCY);
      if (!hueRotationCalculator || hueRotationCalculator.name !== iteration) {
        const originalRange = slide.hueRotation;
        const isEven = iteration % 2 === 0;

        let previousRange = slide.hueRotation;
        if (iteration !== 0) {
          previousRange = isEven
            ? hueRotationCalculator.yRange.slice().reverse()
            : hueRotationCalculator.yRange;
        }

        const getMin = createCalculator({yRange: [originalRange[0], previousRange[1]]});
        const getMax = createCalculator({yRange: [previousRange[0], originalRange[1]]});

        const yRange = [
          isEven ? previousRange[0] : previousRange[1],
          isEven ? getMax(Math.random()) : getMin(Math.random()),
        ];

        hueRotationCalculator = new NamedCalculator(iteration, {yRange});
      }

      hueRotationUniform.value = hueRotationCalculator.calculateY(progress);

      bubbleCalculators.forEach(({getX, getY}, i) => {
        const bubble = bubblesUniform.value[i];
        if (getX && getY) {
          bubble
            .setX(getX(progress))
            .setY(getY(elapsed));
        }
      });
      material.uniformsNeedUpdate = true;
      renderer.render(scene, camera);
    },
  });

  const startRenderingTexturePlane = (texturePlane, themeColor, currentSlide) => {
    if (state.currentTexturePlane) {
      scene.remove(state.currentTexturePlane);
    }
    scene.add(texturePlane);

    state.currentTexturePlane = texturePlane;

    renderer.setClearColor(new THREE.Color(themeColor));

    if (currentSlide && currentSlide.isCustom) {
      customSlideAnimation.start();
      return;
    }
    renderer.render(scene, camera);
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
      customSlideAnimation.stop();
    },
  });

  addSlideChangeListener(({slideIndex, slide}) => {
    state.currentSlide = slide;
    state.currentSlideTexturePlane = slideTexturePlanes[slideIndex];
    startRenderingTexturePlane(state.currentSlideTexturePlane, state.currentSlide.themeColor, state.currentSlide);
  });
};
