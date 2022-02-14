import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator, createCompositeCalculator} from 'helpers/calculator';
import {easeInQuad, easeOutQuad} from 'helpers/easings';

const getOpacity = createCompositeCalculator([
  {xRange: [0, 1], yRange: [0]},
  {xRange: [1, 2], yRange: [1]},
  {xRange: [1099, 1100], yRange: [0]},
]);

const getScale = createCalculator({xRange: [0, 450]});

const getTranslateX = createCalculator({xRange: [0, 500], yRange: [0, -205], onProgress: easeOutQuad});

const getTranslateY = createCompositeCalculator([
  {xRange: [0, 500], yRange: [0, -70], onProgress: easeOutQuad},
  {xRange: [600, 1100], yRange: [-70, 400 + 160 / 2], onProgress: easeInQuad},
]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-flamingo`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 160,
    height: 160,
    scaleX: 1,
    scaleY: 1,
    y: 65,
  }),
  animation: new FrameAnimation({
    delay: 300, // 0:53.8 - 0:54.3 ;0:54.4 - 0:54.9
    duration: 1200,
    onRenderFrame({elapsed}, {state}) {
      state.opacity = getOpacity(elapsed);
      state.scaleX = state.scaleY = getScale(elapsed);
      state.translateX = getTranslateX(elapsed);
      state.translateY = getTranslateY(elapsed);
    },
  }),
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {SceneObjectState} state
   * @param {HTMLImageElement} image
   */
  onRenderObject(context, state, [image]) {
    state.synchronizeHeightIfNeeded(image);
    state.renderImage(context, image);
  },
});
