precision mediump float;

uniform float itemCount;
uniform vec3 color;
uniform vec3 additionalColor;

varying vec2 vUv;

void main() {
  bool isLight = int(mod(vUv.x * itemCount, 2.0)) == 0;

  gl_FragColor = vec4(isLight ? color : additionalColor, 1.0);
}
