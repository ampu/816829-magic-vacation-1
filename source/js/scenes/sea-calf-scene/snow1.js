import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {createCalculator} from 'helpers/calculator';
import {easeInOut} from 'helpers/easings';

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-snow-1 img`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 230,
    centerX: 736 / 1500,
    centerY: 739 / 1500,
    translateX: -218,
    translateY: 65,
    rotate: 7,
    scaleY: -1,
  }),
  animation: new FrameAnimation({
    shouldPreloadFirstFrame: true,
    shouldAlternate: true,
    delay: 700, // 1:12.5
    duration: 1300,
    onProgress: easeInOut,
    userState: {
      getOpacity: createCalculator({xRange: [0, 500]}),
      getTranslateY: createCalculator({yRange: [35, 65]}),
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
