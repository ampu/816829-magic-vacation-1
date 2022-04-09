import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {createCalculator, createRangesCalculator} from 'helpers/calculator';
import {FrameAnimation} from 'helpers/frame-animation';
import {easeInOut} from 'helpers/easings';

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-ice`),
    document.querySelector(`.result__image-animal`),
  ],
  state: new SceneObjectState({
    ice: new SceneObjectState({
      opacity: 1,
      width: 430,
      y: 120,
      translateY: 50,
      rotate: 0,
    }),
    animal: new SceneObjectState({
      opacity: 1,
      width: 510,
      y: 47,
      translateY: 50,
      rotate: 0,
    }),
  }),
  animation: new FrameAnimation({
    delay: 200, // 1:12.0
    duration: 1800,
    userState: {
      getOpacity: createCalculator({xRange: [0, 300]}),
      getTranslateY: createRangesCalculator([
        {xRange: [0, 300], yRange: [630, 0]},
        {xRange: [300, 600], yRange: [0, 90]},
        {xRange: [600, 900], yRange: [90, 35]},
        {xRange: [900, 1200], yRange: [35, 70]},
        {xRange: [1200, 1500], yRange: [70, 45]},
        {xRange: [1500, 1800], yRange: [45, 50]},
      ]),
      getRotate: createRangesCalculator([
        {xRange: [300, 500], yRange: [20, 0], onProgress: easeInOut},
        {xRange: [550, 750], yRange: [0, 5], onProgress: easeInOut},
        {xRange: [800, 1100], yRange: [5, -5], onProgress: easeInOut},
        {xRange: [1100, 1350], yRange: [-5, 1], onProgress: easeInOut},
        {xRange: [1400, 1700], yRange: [1, 0], onProgress: easeInOut},
      ]),
    },
    onRenderFrame({elapsed}, {state: {ice, animal}, getOpacity, getTranslateY, getRotate}) {
      ice.opacity = animal.opacity = getOpacity(elapsed);
      ice.translateY = animal.translateY = getTranslateY(elapsed);
      ice.rotate = animal.rotate = getRotate(elapsed);
    },
  }),
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {SceneObjectState} ice
   * @param {SceneObjectState} animal
   * @param {HTMLImageElement} image
   */
  onRenderObject(context, {ice, animal}, [iceImage, animalImage]) {
    if (ice.shouldRender()) {
      ice.synchronizeHeightIfNeeded(iceImage);
      ice.renderImage(context, iceImage);
    }

    if (animal.shouldRender()) {
      animal.synchronizeHeightIfNeeded(animalImage);
      animal.renderImage(context, animalImage);
    }
  },
});
