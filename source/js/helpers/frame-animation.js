import {MILLISECONDS_IN_SECOND} from './time-helpers';
import {easeLinear} from './easings';

const MAX_PROGRESS = 1;
const MAX_PROGRESS_WITH_ALTERNATION = 2 * MAX_PROGRESS;
const TIME_ORIGIN = Date.now() - Math.trunc(performance.now());

const calculateElapsed = (currentTimestamp, startTimestamp, delay) => {
  return currentTimestamp - (startTimestamp + delay);
};

const calculateProgress = (elapsed, duration, shouldAlternate) => {
  const rawProgress = Math.max(0, elapsed / duration % MAX_PROGRESS_WITH_ALTERNATION);
  return shouldAlternate && rawProgress > MAX_PROGRESS
    ? MAX_PROGRESS_WITH_ALTERNATION - rawProgress
    : Math.min(rawProgress, MAX_PROGRESS);
};

const calculateFrameId = (fps, progress, duration) => {
  return Math.trunc(progress * duration / MILLISECONDS_IN_SECOND * fps);
};

const calculateAnimationDuration = (fps, framesCount) => {
  return Math.ceil(MILLISECONDS_IN_SECOND / fps * (framesCount - 1));
};

export class FrameAnimation {
  /**
   * @param {bool} shouldPreloadFirstFrame
   * @param {bool} shouldAlternate
   * @param {number} delay
   * @param {number} duration
   * @param {number} fps
   * @param {any[]} frames
   * @param {any} userState
   * @param {Easing} onProgress
   * @param {function} onRenderFrame
   */
  constructor({
    shouldPreloadFirstFrame = true,
    shouldAlternate = false,
    delay = 0,
    duration,
    fps = 60,
    frames,
    userState,
    onProgress = easeLinear,
    onRenderFrame,
  }) {
    this._shouldPreloadFirstFrame = shouldPreloadFirstFrame;
    this._shouldAlternate = shouldAlternate;

    this._delay = delay;
    this._fps = fps;
    this._frames = frames;
    this._duration = duration || calculateAnimationDuration(fps, frames.length);
    this._onProgress = onProgress;
    this._onRenderFrame = onRenderFrame;

    this._delayTimer = 0;
    this._startTimestamp = 0;
    this._latestAnimationFrameId = 0;
    this._latestRenderState = null;

    this._userState = userState;
    this._onFrame = this._onFrame.bind(this);
    this._calculateFrame = this._calculateFrame.bind(this);
  }

  setState(state) {
    this._userState = this._userState || {};
    this._userState.state = state;
  }

  getStartTimestamp() {
    return this._startTimestamp;
  }

  hasStarted() {
    return this.getStartTimestamp() > 0;
  }

  start(startTimestamp) {
    this._startTimestamp = startTimestamp || Date.now();
    if (this._shouldPreloadFirstFrame) {
      this._calculateFrame(performance.now(), false);
    }
    this._delayTimer = setTimeout(this._onFrame, this._delay);
  }

  stop() {
    this._startTimestamp = 0;

    if (this._delayTimer > 0) {
      clearTimeout(this._delayTimer);
      this._delayTimer = 0;
    }

    if (this._latestAnimationFrameId > 0) {
      cancelAnimationFrame(this._latestAnimationFrameId);
      this._latestAnimationFrameId = 0;
      this._latestRenderState = null;
      this._startTimestamp = 0;
    }
  }

  _calculateFrame(performanceNow, shouldRequestNextFrameIfNeeded) {
    const currentTimestamp = TIME_ORIGIN + Math.trunc(performanceNow);
    const elapsed = calculateElapsed(currentTimestamp, this._startTimestamp, this._delay);
    const progress = this._onProgress(calculateProgress(elapsed, this._duration, this._shouldAlternate));
    const renderFrameId = calculateFrameId(this._fps, progress, this._duration);

    if (this._latestRenderState && this._latestRenderState.frameId === renderFrameId) {
      this._latestAnimationFrameId = requestAnimationFrame(this._onFrame);
      return;
    }

    this._latestRenderState = {
      duration: this._duration,
      elapsed,
      progress,
      regress: 1 - progress,
      frameId: renderFrameId,
      frame: this._frames ? this._frames[renderFrameId] : undefined,
    };

    this._onRenderFrame(this._latestRenderState, this._userState);

    if (progress < MAX_PROGRESS || this._shouldAlternate) {
      if (shouldRequestNextFrameIfNeeded) {
        this._latestAnimationFrameId = requestAnimationFrame(this._onFrame);
      }
      return;
    }
    this._latestAnimationFrameId = 0;
  }

  _onFrame(performanceNow) {
    this._calculateFrame(performanceNow || performance.now(), true);
  }
}
