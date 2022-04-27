import {NullRig} from '3d/rigs/null-rig';
import {createCalculator, createRangesCalculator, createVectorCalculator} from 'helpers/calculator';
import {FrameAnimation} from 'helpers/frame-animation';
import {easeInOut} from 'helpers/easings';

const THRESHOLD_PROGRESS = 0.5;
const PROGRESS_STEP = 0.001;
const MAX_ROTATION = 360;

export const createKeyholeHistoryRig = (target, {
  radiusRange: [historyRadius, thresholdRadius, keyholeRadius],
  heightRange: [historyHeight, keyholeHeight],
  targetLookRange: [historyLook, keyholeLook],
}) => {
  const nullRig = new NullRig(target);

  const getRadius = createRangesCalculator([
    {xRange: [0, THRESHOLD_PROGRESS], yRange: [historyRadius, thresholdRadius]},
    {xRange: [THRESHOLD_PROGRESS, 1], yRange: [thresholdRadius, keyholeRadius]},
  ]);
  const getHeight = createCalculator({xRange: [0, THRESHOLD_PROGRESS], yRange: [historyHeight, keyholeHeight]});
  const getTargetLook = createVectorCalculator({xRange: [THRESHOLD_PROGRESS - PROGRESS_STEP, THRESHOLD_PROGRESS], yRange: [historyLook, keyholeLook]});
  const getOrbitRotationY = createCalculator({xRange: [0, 4], yRange: [0, MAX_ROTATION]});

  const createHistoryAnimation = (historySceneIndex, duration) => {
    const startRotation = nullRig.getOrbitRotation();
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
        nullRig.setOrbitRotationY(progress >= 1 ? endRotation : getAnimationOrbitRotationY(progress));
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
        const t = isForward ? progress : regress;
        nullRig.setRadius(getRadius(t));
        nullRig.setHeight(getHeight(t));
        nullRig.setTargetLook(getTargetLook(t));
        nullRig.invalidate();
      },
    });
  };

  return {
    invalidate() {
      nullRig.invalidate();
    },
    setRadiusProgress(progress) {
      nullRig.setRadius(getRadius(progress));
    },
    setHeightProgress(progress) {
      nullRig.setHeight(getHeight(progress));
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
