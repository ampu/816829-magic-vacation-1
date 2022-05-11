import * as THREE from 'three';

import {RADIAN} from 'helpers/calculator';
import {wrapObject} from '3d/helpers/object-helpers';

export class NullRig {
  constructor(parent) {
    this._target = new THREE.Group();
    this._orbit = wrapObject(this._target);
    this._root = wrapObject(this._orbit);
    parent.add(this._root);

    this._targetPosition = this._target.position.clone();
    this._isTargetPositionChanged = false;

    this._orbitRotationY = 0;
    this._isOrbitRotationYChanged = true;

    this._targetLook = [0, 0, 0];
    this._isTargetLookChanged = true;
  }

  getRoot() {
    return this._root;
  }

  getTarget() {
    return this._target;
  }

  getRadius() {
    return Math.hypot(this._targetPosition.x, this._targetPosition.z);
  }

  getHeight() {
    return this._targetPosition.y;
  }

  getOrbitRotation() {
    return this._orbitRotationY;
  }

  getLook() {
    return this._targetLook;
  }

  setRadius(radius) {
    const x = Math.sqrt(radius ** 2 / 2);
    if (radius !== x) {
      this._targetPosition.x = this._targetPosition.z = x;
      this._isTargetPositionChanged = true;
      this._isTargetLookChanged = !!this._targetLook;
    }
  }

  setHeight(height) {
    if (height !== this._targetPosition.y) {
      this._targetPosition.y = height;
      this._isTargetPositionChanged = true;
      this._isTargetLookChanged = !!this._targetLook;
    }
  }

  setOrbitRotationY(rotation) {
    if (rotation !== this._orbitRotationY) {
      this._orbitRotationY = rotation;
      this._isOrbitRotationYChanged = true;
      this._isTargetLookChanged = !!this._targetLook;
    }
  }

  setTargetLook(look) {
    if (!this._targetLook || this._targetLook.some((x, i) => x !== look[i])) {
      this._targetLook = look;
      this._isTargetLookChanged = true;
    }
  }

  invalidate() {
    let isRendered = false;

    if (this._isOrbitRotationYChanged) {
      this._orbit.rotation.y = this._orbitRotationY / RADIAN;
      this._isOrbitRotationYChanged = false;
      isRendered = true;
    }

    if (this._isTargetPositionChanged) {
      this._target.position.copy(this._targetPosition);
      this._isTargetPositionChanged = false;
      isRendered = true;
    }

    if (this._isTargetLookChanged) {
      this._target.lookAt(...this._targetLook);
      this._isTargetLookChanged = false;
      isRendered = true;
    }

    return isRendered;
  }
}
