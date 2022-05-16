import * as THREE from 'three';

import vertexShader from 'glsl/base-vertex-shader';
import fragmentShader from 'glsl/custom-fragment-shader';

export default class BubblesMaterial extends THREE.RawShaderMaterial {
  constructor({
    map,
    aspect,
    hueRotation = 0,
    bubbles = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ],
  }) {
    super({
      transparent: true,
      uniforms: {
        map: {
          value: map,
        },
        aspect: {
          value: aspect,
        },
        hueRotation: {
          value: hueRotation,
        },
        bubbles: {
          value: bubbles,
        },
      },
      vertexShader,
      fragmentShader,
    });
  }
}
