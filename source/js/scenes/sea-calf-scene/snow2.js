import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator} from 'helpers/calculator';
import {easeInOut} from 'helpers/easings';

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-snow-2 img`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 180,
    centerX: 736 / 1500,
    centerY: 739 / 1500,
    translateX: 215,
    translateY: 130,
    rotate: 15,
    scaleX: -1,
  }),
  animation: new FrameAnimation({
    shouldPreloadFirstFrame: true,
    shouldAlternate: true,
    delay: 900, // 1:12.7
    duration: 1100,
    onProgress: easeInOut,
    userState: {
      getOpacity: createCalculator({xRange: [0, 500]}),
      getTranslateY: createCalculator({yRange: [100, 130]}),
    },
    onRenderFrame({progress, elapsed}, {state, getOpacity, getTranslateY}) {
      state.opacity = getOpacity(elapsed);
      state.translateY = getTranslateY(progress);
    },
  }),
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {SceneObjectState} state
   * @param {HTMLImageElement} image
   */
  onRenderObject(context, state, [image]) {
    image.style = [
      // `display: flex`,
      `filter: grayscale(100%)`,
    ].join(`; `);

    state.synchronizeHeightIfNeeded(image);
    state.renderImage(context, image);
  },
});
