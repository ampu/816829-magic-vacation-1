import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator, createRangesCalculator} from 'helpers/calculator';
import {easeInQuad, easeOutQuad} from 'helpers/easings';

const getOpacity = createRangesCalculator([
  {xRange: [0, 1], yRange: [0]},
  {xRange: [1, 2], yRange: [1]},
  {xRange: [1150, 1450], yRange: [1, 0]},
]);

const getScale = createCalculator({xRange: [0, 550]});

const getTranslateX = createCalculator({xRange: [0, 600], yRange: [0, 185], onProgress: easeOutQuad});

const getTranslateY = createRangesCalculator([
  {xRange: [0, 600], yRange: [0, 15], onProgress: easeOutQuad},
  {xRange: [700, 1450], yRange: [15, 760], onProgress: easeInQuad},
]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-snowflake`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 120,
    height: 120,
    scaleX: 1,
    scaleY: 1,
    y: 65,
  }),
  animation: new FrameAnimation({
    delay: 300, // 0:53.8 - 0:54.4; 0:54.5 - 0:54.95
    duration: 1450,
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
