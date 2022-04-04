import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {convertTangentToDegrees, convertDegreesToRadians, createSineCalculator, createCalculator} from 'helpers/calculator';
import {ease} from 'helpers/easings';

const HORIZONTAL_PLANE_ROTATE = 47;
const MOTION_ROTATE = -12;
const PLANE_MOTION_WIDTH = 415;

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-plane`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 140,
    translateX: 415,
    translateY: 14,
    rotate: 7,
  }),
  animation: new FrameAnimation({
    delay: 500, // 1:12.3
    duration: 550,
    onProgress: ease,
    userState: {
      getOpacity: createCalculator({xRange: [0, 200]}),
      getTranslateX: createCalculator({yRange: [0, PLANE_MOTION_WIDTH]}),
      motion: createSineCalculator({x: -130, y: -10, width: PLANE_MOTION_WIDTH, height: 190, amplitude: 750}),
    },
    onRenderFrame({progress, elapsed}, {state, getOpacity, getTranslateX, motion}) {
      state.opacity = getOpacity(elapsed);
      state.translateX = getTranslateX(progress);
      state.translateY = motion.calculateY(progress);
      state.rotate = HORIZONTAL_PLANE_ROTATE + convertTangentToDegrees(motion.calculateTangent(progress));
    },
  }),
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {SceneObjectState} state
   * @param {HTMLImageElement} image
   */
  onRenderObject(context, state, [image]) {
    state.synchronizeHeightIfNeeded(image);

    state.save(context);

    context.rotate(convertDegreesToRadians(MOTION_ROTATE));
    state.transform(context);
    state.doRenderImage(context, image);

    state.restore(context);
  },
});
