import {NullRig} from '3d/rigs/null-rig';
import {createCalculator, createRangesCalculator, createVectorCalculator, RADIAN} from 'helpers/calculator';
import {FrameAnimation} from 'helpers/frame-animation';
import {easeInOut} from 'helpers/easings';

const THRESHOLD_PROGRESS = 0.5;
const PROGRESS_STEP = 0.001;
const MAX_ROTATION = 360;
const MAX_CURSOR_ROTATION = [5, 5];

export const createKeyholeHistoryRig = ({
  parent,
  background,
  suitcase,
  lights,
  pointLights,
  radiusRange: [historyRadius, thresholdRadius, keyholeRadius],
  heightRange: [historyHeight, keyholeHeight],
  maxCursorRotation: [maxCursorRotationX, maxCursorRotationY] = MAX_CURSOR_ROTATION,
  targetLookRange: [historyLook, keyholeLook],
}) => {
  const nullRig = new NullRig(parent);

  const getRadius = createRangesCalculator([
    {xRange: [0, THRESHOLD_PROGRESS], yRange: [historyRadius, thresholdRadius]},
    {xRange: [THRESHOLD_PROGRESS, 1], yRange: [thresholdRadius, keyholeRadius]},
  ]);
  const getHeight = createCalculator({xRange: [0, THRESHOLD_PROGRESS], yRange: [historyHeight, keyholeHeight]});
  const getTargetLook = createVectorCalculator({xRange: [THRESHOLD_PROGRESS - PROGRESS_STEP, THRESHOLD_PROGRESS], yRange: [historyLook, keyholeLook]});
  const getOrbitRotationY = createCalculator({xRange: [0, 4], yRange: [0, MAX_ROTATION]});
  const getBackgroundOpacity = createRangesCalculator([
    {xRange: [0.1, 0.3], yRange: [1, 0]},
    {xRange: [0.5, 0.7], yRange: [0, 1]},
  ]);

  const getCursorRotationX = createCalculator({yRange: [0, maxCursorRotationX]});
  const getCursorRotationY = createCalculator({yRange: [0, maxCursorRotationY]});

  const createAnimationCursorRotationCalculator = (currentCursorRotation) => {
    return createRangesCalculator([
      {xRange: [0, 0.5], yRange: [currentCursorRotation, 0]},
      {xRange: [0.5, 1], yRange: [0, currentCursorRotation]},
    ]);
  };

  let getAnimationCursorRotationX;
  let getAnimationCursorRotationY;

  const createHistoryAnimation = (historySceneIndex, duration) => {
    const startRotation = nullRig.getOrbitRotationY();
    const endRotation = getOrbitRotationY(historySceneIndex);

    const smoothStartRotation = endRotation - startRotation > MAX_ROTATION / 2
      ? startRotation + MAX_ROTATION
      : startRotation;

    const smoothEndRotation = startRotation - endRotation > MAX_ROTATION / 2
      ? endRotation + MAX_ROTATION
      : endRotation;

    const getAnimationOrbitRotationY = createCalculator({yRange: [smoothStartRotation, smoothEndRotation]});
    return new FrameAnimation({
      name: `history-animation`,
      duration,
      onProgress: easeInOut,
      onRenderFrame({progress}) {
        const rotationY = progress >= 1 ? endRotation : getAnimationOrbitRotationY(progress);
        suitcase.rotation.y = rotationY / RADIAN;

        nullRig.setOrbitRotationY(rotationY);
        nullRig.invalidate();
      },
    });
  };

  const createKeyholeAnimation = (isForward, duration) => {
    return new FrameAnimation({
      name: `keyhole-animation`,
      duration,
      onProgress: easeInOut,
      onRenderFrame({progress, regress}) {
        if (progress === 0) {
          getAnimationCursorRotationX = createAnimationCursorRotationCalculator(nullRig.getCursorRotationX());
          getAnimationCursorRotationY = createAnimationCursorRotationCalculator(nullRig.getCursorRotationY());
        }

        nullRig.setCursorRotationX(getAnimationCursorRotationX(progress));
        nullRig.setCursorRotationY(getAnimationCursorRotationY(progress));

        const t = isForward ? progress : regress;
        nullRig.setRadius(getRadius(t));
        nullRig.setHeight(getHeight(t));
        nullRig.setTargetLook(getTargetLook(t));
        nullRig.invalidate();

        background.material.opacity = getBackgroundOpacity(t);

        if (t === 0) {
          if (isForward) {
            lights.remove(pointLights);
          } else {
            lights.add(pointLights);
          }
        }
      },
    });
  };

  return {
    getTarget() {
      return nullRig.getTarget();
    },
    invalidate() {
      nullRig.invalidate();
    },
    setRadiusProgress(progress) {
      nullRig.setRadius(getRadius(progress));
    },
    setHeightProgress(progress) {
      nullRig.setHeight(getHeight(progress));
    },
    setCursorRotationProgress([xProgress, yProgress]) {
      nullRig.setCursorRotationX(Math.sign(xProgress) * getCursorRotationX(Math.abs(xProgress)));
      nullRig.setCursorRotationY(Math.sign(yProgress) * getCursorRotationY(Math.abs(yProgress)));
    },
    setTargetLookProgress(progress) {
      nullRig.setTargetLook(getTargetLook(progress));
    },
    setHistorySceneIndex(historySceneIndex) {
      nullRig.setOrbitRotationY(getOrbitRotationY(historySceneIndex));
    },
    startHistoryAnimation(historySceneIndex, duration) {
      const animation = createHistoryAnimation(historySceneIndex, duration);
      animation.start();
      return animation;
    },
    startKeyholeAnimation(isForward, duration) {
      const animation = createKeyholeAnimation(isForward, duration);
      animation.start();
      return animation;
    },
  };
};
