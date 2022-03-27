import * as THREE from 'three';

// language=glsl
const CARPET_MAP_PARS_FRAGMENT = `
  uniform float itemCount;
  uniform vec3 color;
  uniform vec3 additionalColor;
`;

// language=glsl
const CARPET_MAP_FRAGMENT = `
  bool isLight = int(mod(vUv.x * itemCount, 2.0)) == 0;

  diffuseColor = vec4(isLight ? color : additionalColor, 1.0);
`;

// language=glsl
THREE.ShaderChunk[`map_pars_fragment`] = `
  #ifdef IS_CARPET
  ${CARPET_MAP_PARS_FRAGMENT}
  #endif
  ${THREE.ShaderChunk.map_pars_fragment}
`;

// language=glsl
THREE.ShaderChunk[`map_fragment`] = `
  #ifdef IS_CARPET
  ${CARPET_MAP_FRAGMENT}
  #else
  ${THREE.ShaderChunk.map_fragment}
  #endif
`;

export default class CarpetMaterial extends THREE.MeshStandardMaterial {
  constructor({
    itemCount,
    color,
    additionalColor,
    ...parameters
  }) {
    super(parameters);

    Object.assign(this.defines, {
      USE_UV: true,
      IS_CARPET: true,
    });

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, {
        itemCount: {
          value: itemCount,
        },
        color: {
          value: new THREE.Color(color),
        },
        additionalColor: {
          value: new THREE.Color(additionalColor),
        },
      });
    };
  }
}
