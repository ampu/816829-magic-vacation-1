import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator, createRangesCalculator} from 'helpers/calculator';
import {easeInQuad, easeOutQuad} from 'helpers/easings';

const getOpacity = createRangesCalculator([
  {xRange: [0, 1], yRange: [0]},
  {xRange: [1, 2], yRange: [1]},
  {xRange: [949, 950], yRange: [0]},
]);

const getScale = createCalculator({xRange: [0, 400]});

const getTranslateX = createCalculator({xRange: [0, 450], yRange: [0, -415], onProgress: easeOutQuad});

const getTranslateY = createRangesCalculator([
  {xRange: [0, 450], yRange: [0, 95], onProgress: easeOutQuad},
  {xRange: [500, 950], yRange: [95, 400 + 150 / 2], onProgress: easeInQuad},
]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-watermelon`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 150,
    height: 150,
    scaleX: 1,
    scaleY: 1,
    y: 65,
  }),
  animation: new FrameAnimation({
    delay: 300, // 0:53.8 - 0:54.25; 0:54.3 - 0:54.75
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
