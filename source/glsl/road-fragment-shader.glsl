precision mediump float;

uniform vec3 asphaltColor;
uniform float asphaltWidth;
uniform float stripOffset;
uniform float stripeCount;
uniform float stripeWidth;
uniform vec3 stripeColor;

varying vec2 vUv;

void main() {
  float stripeWidthPercentage = stripeWidth / asphaltWidth;
  float stripeOffsetPercentage = (1.0 - stripeWidthPercentage) / 2.0;
  float stripeX = fract((vUv.x + stripOffset) * stripeCount);

  bool isStripeUpperY = stripeOffsetPercentage / 4.0 < vUv.y && vUv.y < (stripeOffsetPercentage + stripeWidthPercentage) / 4.0;
  bool isStripeLowerY = stripeOffsetPercentage / 4.0 < vUv.y - 0.5 && vUv.y - 0.5 < (stripeOffsetPercentage + stripeWidthPercentage) / 4.0;
  bool isStripeY = isStripeUpperY || isStripeLowerY;
  bool isStripeX = 1.0 / 3.0 < stripeX && stripeX < 2.0 / 3.0;

  if (isStripeX && isStripeY) {
    gl_FragColor = vec4(stripeColor, 1.0);
  }
  else {
    gl_FragColor = vec4(asphaltColor, 1.0);
  }
}
