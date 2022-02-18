import * as THREE from 'three';

import vertexShader from 'glsl/base-vertex-shader';
import fragmentShader from 'glsl/base-fragment-shader';

export default class TextureMaterial extends THREE.RawShaderMaterial {
  constructor(texture) {
    super({
      uniforms: {
        map: {
          value: texture
        },
      },
      vertexShader,
      fragmentShader,
    });
  }
}
