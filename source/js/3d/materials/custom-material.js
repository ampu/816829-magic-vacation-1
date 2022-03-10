import * as THREE from 'three';

import vertexShader from 'glsl/custom-vertex-shader';
import fragmentShader from 'glsl/custom-fragment-shader';

export default class CustomMaterial extends THREE.RawShaderMaterial {
  constructor({
    map,
    aspect,
    hueRotation,
    bubbles,
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
      fragmentShader: fragmentShader.split(`;`).join(`;\n`),
    });
  }
}
