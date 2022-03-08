precision mediump float;

uniform sampler2D map;
uniform float time;
uniform float transitionProgress;
uniform float noiseAmplitude;
uniform float prevNoiseAmplitude;
uniform float noiseSize;

varying vec2 vUv;

#define PI 3.14159265359
#define PI_HALF 1.5707963267949

highp float rand(const in vec2 uv) {
  return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec4 texel = texture2D(map, vUv);

  float xNormalized = floor(gl_FragCoord.x / noiseSize);
  float yNormalized = floor(gl_FragCoord.y / noiseSize);

  float currentNoiseAmplitude = prevNoiseAmplitude + (noiseAmplitude - prevNoiseAmplitude) * sin(transitionProgress * PI_HALF);

  float seedPeriod = 100.0;
  float seedFrequency = 1.0 / 12.0;
  float seed = floor(mod(time, seedPeriod) / seedFrequency);
  float mixFrequency = 0.002;

  vec4 noise = 0.08 * currentNoiseAmplitude * vec4(rand(vec2(xNormalized * mixFrequency * seed, yNormalized * mixFrequency * seed)));

  gl_FragColor = texel + noise;
}
