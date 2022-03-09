import * as THREE from 'three';

import vertexShader from 'glsl/hue-rotation-vertex-shader';
import fragmentShader from 'glsl/hue-rotation-fragment-shader';

export default class HueRotationTextureMaterial extends THREE.RawShaderMaterial {
  constructor(texture, amount) {
    super({
      uniforms: {
        map: {
          value: texture
        },
        amount: {
          value: amount,
        },
      },
      vertexShader,
      fragmentShader: fragmentShader.split(`;`).join(`;\n`),
    });
  }
}
