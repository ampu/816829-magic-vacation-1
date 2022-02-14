import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCompositeCalculator} from 'helpers/calculator';

const AMPLITUDE = 1700;
const HEIGHT = 59;
const MAX_SCALE_Y = 1.1;

const getScaleX = createCompositeCalculator([
  {xRange: [0, 500], yRange: [0, 1]},
  {xRange: [650, 950], yRange: [1, 0.9]},
  {xRange: [950, 1150], yRange: [0.9, 0]},
]);

const getScaleY = createCompositeCalculator([
  {xRange: [0, 500], yRange: [0, 1]},
  {xRange: [650, 950], yRange: [1, MAX_SCALE_Y]},
  {xRange: [950, 1150], yRange: [MAX_SCALE_Y, 0]},
]);

const getCenterY = createCompositeCalculator([
  {xRange: [949, 950], yRange: [0]},
  {xRange: [950, 951], yRange: [0.5]},
]);

const getTranslateY = createCompositeCalculator([
  {xRange: [650, 950], yRange: [0, 35]},
  {xRange: [950, 951], yRange: [35 + MAX_SCALE_Y * HEIGHT / 2]},
]);

const getOpacity = createCompositeCalculator([
  {xRange: [0, 1], yRange: [0, 1]},
  {xRange: [950, 1150], yRange: [1, 0]},
]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-drop`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 39,
    height: HEIGHT,
    y: 123,
    x: -30,
    centerY: 0,
  }),
  animation: new FrameAnimation({
    delay: 1500, // 0:55.0 - 0:55.5; 0:55.65 - 0:55.95; 0:55.95 - 0:56.15; 0:56.7
    duration: Infinity,
    onRenderFrame({elapsed}, {state}) {
      const amplitudeElapsed = elapsed % AMPLITUDE;

      state.opacity = getOpacity(amplitudeElapsed);
      state.scaleX = getScaleX(amplitudeElapsed);
      state.scaleY = getScaleY(amplitudeElapsed);
      state.translateY = getTranslateY(amplitudeElapsed);
      state.centerY = getCenterY(amplitudeElapsed);
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
