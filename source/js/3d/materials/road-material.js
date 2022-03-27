import * as THREE from 'three';

// language=glsl
const ROAD_MAP_PARS_FRAGMENT = `
  uniform vec3 color;
  uniform float width;
  uniform float stripOffset;
  uniform float stripeCount;
  uniform float stripeWidth;
  uniform vec3 stripeColor;
`;

// language=glsl
const ROAD_MAP_FRAGMENT = `
  float stripeWidthPercentage = stripeWidth / width;
  float stripeOffsetPercentage = (1.0 - stripeWidthPercentage) / 2.0;
  float stripeX = fract((vUv.x + stripOffset) * stripeCount);

  bool isStripeUpperY = stripeOffsetPercentage / 4.0 < vUv.y && vUv.y < (stripeOffsetPercentage + stripeWidthPercentage) / 4.0;
  bool isStripeLowerY = stripeOffsetPercentage / 4.0 < vUv.y - 0.5 && vUv.y - 0.5 < (stripeOffsetPercentage + stripeWidthPercentage) / 4.0;
  bool isStripeY = isStripeUpperY || isStripeLowerY;
  bool isStripeX = 1.0 / 3.0 < stripeX && stripeX < 2.0 / 3.0;

  diffuseColor = vec4(isStripeX && isStripeY ? stripeColor : color, 1.0);
`;

// language=glsl
THREE.ShaderChunk[`map_fragment`] = `
  #ifdef IS_ROAD
  ${ROAD_MAP_FRAGMENT}
  #else
  ${THREE.ShaderChunk.map_fragment}
  #endif
`;

// language=glsl
THREE.ShaderChunk[`map_pars_fragment`] = `
  #ifdef IS_ROAD
  ${ROAD_MAP_PARS_FRAGMENT}
  #endif
  ${THREE.ShaderChunk.map_pars_fragment}
`;

export default class RoadMaterial extends THREE.MeshStandardMaterial {
  constructor({
    width,
    color,
    stripOffset,
    stripeCount,
    stripeWidth,
    stripeColor,
    ...parameters
  }) {
    super(parameters);

    Object.assign(this.defines, {
      USE_UV: true,
      IS_ROAD: true,
    });

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, {
        width: {
          value: width,
        },
        color: {
          value: new THREE.Color(color),
        },
        stripOffset: {
          value: stripOffset,
        },
        stripeCount: {
          value: stripeCount,
        },
        stripeWidth: {
          value: stripeWidth,
        },
        stripeColor: {
          value: new THREE.Color(stripeColor),
        },
      });
    };
  }
}
