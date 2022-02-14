import {SceneObject} from 'scenes/scene-object';
import {SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {convertDegreesToRadians} from 'helpers/calculator';

const MASK = {
  angles: [-90, -312],
  radius: 178 / 2,
  size: 400,
  upperY: -3,
  lowerY: 215,
};

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-negative-crocodile`),
  ],
  state: new SceneObjectState({
    opacity: 0,
    width: 750,
    x: -10,
    y: 110,
    translateY: -150,
    translateX: 300,
  }),
  animation: new FrameAnimation({
    delay: 900, // 0:54.4
    duration: 500,
    onRenderFrame({frameId, regress}, {state}) {
      state.opacity = frameId > 0 ? 1 : 0;
      state.translateY = -150 * regress;
      state.translateX = 300 * regress;
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

    context.beginPath();
    context.arc(0, MASK.upperY, MASK.radius, convertDegreesToRadians(MASK.angles[0]), convertDegreesToRadians(MASK.angles[1]), false);
    context.lineTo(MASK.radius, MASK.lowerY);
    context.lineTo(MASK.radius, MASK.size);
    context.lineTo(-MASK.size, MASK.size);
    context.lineTo(-MASK.size, -MASK.size);
    context.lineTo(0, -MASK.size);
    context.clip();

    state.transform(context);
    state.doRenderImage(context, image);
    state.restore(context);
  },
});
