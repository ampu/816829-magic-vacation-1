export class CompositeAnimation {
  constructor(animations) {
    this._animations = animations;
  }

  start() {
    for (const animation of this._animations) {
      animation.start();
    }
  }

  stop() {
    for (const animation of this._animations) {
      animation.stop();
    }
  }
}
