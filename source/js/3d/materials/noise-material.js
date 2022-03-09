import * as THREE from 'three';

import vertexShader from 'glsl/base-vertex-shader';
import fragmentShader from 'glsl/noize-fragment-shader';

export default class NoiseMaterial extends THREE.RawShaderMaterial {
  constructor(texture, {time = 0, amplitude = 2, size = 2} = {}) {
    super({
      uniforms: {
        map: {
          value: texture
        },
        noiseAmplitude: {
          value: amplitude
        },
        prevNoiseAmplitude: {
          value: amplitude
        },
        noiseSize: {
          value: size
        },
        time: {
          value: time,
        },
        transitionProgress: {
          value: 0,
        }
      },
      vertexShader,
      fragmentShader,
    });
  }
}
