import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-lock`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 178,
    y: 60,
    scaleX: 0.8,
    scaleY: 0.8,
  }),
  animation: new FrameAnimation({
    delay: 150, // 0:53.65
    duration: 200,
    onRenderFrame({progress}, {state}) {
      state.opacity = progress;
      state.scaleX = state.scaleY = 0.8 + progress * 0.2;
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
