import flatten from 'lodash/flatten';

import {SceneObject} from 'scenes/scene-object';
import {renderPolyline, renderNativeBezier, SceneObjectState} from 'scenes/scene-object-state';
import {FrameAnimation} from 'helpers/frame-animation';
import {convertDegreesToRadians} from 'helpers/calculator';
import {ease} from 'helpers/easings';
import {CubicBezier} from 'helpers/cubic-bezier';

const FILL_STYLE = `#acc3ff`;
const CENTER = [-37, -109];
const ARC_ANGLES = [90, 270].map(convertDegreesToRadians);

const endMotion = new CubicBezier([0, 0], [128, 0], [256, 175], [414, 106]);

export default new SceneObject({
  images: [
    document.querySelector(`.result__image-blob img`),
  ],
  state: new SceneObjectState({
    opacity: 1,
    radius: 170,
    end: [414, 106],
    upper1: [128, 0],
    upper2: [256, 175],
    lower1: [326, 248],
    lower2: [192, 340],
  }),
  animation: new FrameAnimation({
    delay: 500, // 1:12.3
    duration: 550,
    onProgress: ease,
    onRenderFrame({progress, regress}, {state}) {
      const upper2Y = 175 * progress;
      const lower1Y = 106 + 142 * progress;

      state.opacity = progress;
      state.radius = 170 * progress;
      state.end = [endMotion.calculateX(progress), endMotion.calculateY(progress)];

      state.upper1 = [128 * progress, 0 * progress];
      state.upper2 = [256 * progress, upper2Y * progress];
      state.lower1 = [326 * progress, lower1Y * progress];
      state.lower2 = [192 * progress, 340 * progress];
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
      'filter: sepia(100%)',
    ].join(`; `);

    if (!state.shouldRender()) {
      return;
    }
    const {
      opacity,
      radius,
      end,
      upper1,
      upper2,
      lower1,
      lower2,
    } = state;

    const [centerX, centerY] = CENTER;

    const endX = centerX + end[0];
    const endY = centerY + end[1];

    const upperCurve = [
      [centerX, centerY],
      [centerX + upper1[0], centerY + upper1[1]],
      [centerX + upper2[0], centerY + upper2[1]],
      [endX, endY],
    ];

    const lowerCurve = [
      [endX, endY],
      [centerX + lower1[0], centerY + lower1[1]],
      [centerX + lower2[0], centerY + lower2[1]],
      [centerX, centerY + 2 * radius],
    ];

    context.save();

    context.beginPath();
    context.arc(centerX, centerY + radius, radius, ARC_ANGLES[0], ARC_ANGLES[1], false);
    context.bezierCurveTo(...flatten(upperCurve.slice(1)));
    context.bezierCurveTo(...flatten(lowerCurve.slice(1)));
    context.globalAlpha = opacity;
    context.fillStyle = FILL_STYLE;
    context.fill();

    context.restore();
  },
});
