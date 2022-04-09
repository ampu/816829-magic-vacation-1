import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator, createRangesCalculator} from 'helpers/calculator';
import {easeInQuad, easeOutQuad} from 'helpers/easings';

const getOpacity = createRangesCalculator([
  {xRange: [0, 1], yRange: [0]},
  {xRange: [1, 2], yRange: [1]},
  {xRange: [1049, 1050], yRange: [0]},
]);

const getScale = createCalculator({xRange: [0, 450]});

const getTranslateX = createCalculator({xRange: [0, 500], yRange: [0, 345], onProgress: easeOutQuad});

const getTranslateY = createRangesCalculator([
  {xRange: [0, 500], yRange: [0, -138], onProgress: easeOutQuad},
  {xRange: [550, 1050], yRange: [-138, 400 + 180 / 2], onProgress: easeInQuad},
]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-leaf`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 180,
    height: 180,
    scaleX: 1,
    scaleY: 1,
    y: 65,
  }),
  animation: new FrameAnimation({
    delay: 300, // 0:53.8 - 0:54.35 - 0:54.85
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
