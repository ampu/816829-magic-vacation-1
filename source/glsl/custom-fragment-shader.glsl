precision mediump float;

#define PI 3.1415926535897932384626433832795

uniform sampler2D map;
uniform vec2 aspect;
uniform float hueRotation;
uniform vec3 bubbles[3];

varying vec2 vUv;

const float BORDER_WIDTH = 0.0025;
const vec4 BORDER_TEXEL = vec4(1.0, 1.0, 1.0, 0.15);

const float GLARE_OFFSET_RATIO = 0.85;
const vec2 GLARE_ANGLE = vec2(PI * 0.65, PI * 0.85);

vec4 convertRgbToHsl(vec4 rgba) {
  float r = rgba.r;
  float g = rgba.g;
  float b = rgba.b;

  float maxValue = max(max(r, g), b);
  float minValue = min(min(r, g), b);

  float h = 0.0;
  if (maxValue == minValue) {
    h = 0.0;
  }
  else if (maxValue == r && g >= b) {
    h = 60.0 * (g - b) / (maxValue - minValue) + 0.0;
  }
  else if (maxValue == r && g < b) {
    h = 60.0 * (g - b) / (maxValue - minValue) + 360.0;
  }
  else if (maxValue == g) {
    h = 60.0 * (b - r) / (maxValue - minValue) + 120.0;
  }
  else {
    h = 60.0 * (r - g) / (maxValue - minValue) + 240.0;
  }
  float s = maxValue == minValue ? 0.0 : ((maxValue - minValue) / (1.0 - abs(1.0 - (maxValue + minValue))));
  float l = (maxValue + minValue) / 2.0;

  return vec4(h, s, l, rgba.a);
}

vec4 convertHslToRgb(vec4 hsla) {
  float h = hsla.x / 360.0;
  float s = hsla.y;
  float l = hsla.z;

  float q = l < 0.5
    ? l * (1.0 + s)
    : l + s - l * s;

  float p = 2.0 * l - q;

  vec3 hues = vec3(
    h + 1.0 / 3.0,
    h,
    h - 1.0 / 3.0
  );

  vec4 rgba = vec4(0.0, 0.0, 0.0, hsla.a);
  for (int i = 0; i <= 2; i++) {
    if (hues[i] < 0.0) {
      hues[i] += 1.0;
    }
    else if (hues[i] > 1.0) {
      hues[i] -= 1.0;
    }

    if (hues[i] < 1.0 / 6.0) {
      rgba[i] = p + ((q - p) * 6.0 * hues[i]);
    }
    else if (1.0 / 6.0 <= hues[i] && hues[i] < 1.0 / 2.0) {
      rgba[i] = q;
    }
    else if (1.0 / 2.0 <= hues[i] && hues[i] < 2.0 / 3.0) {
      rgba[i] = p + ((q - p) * (2.0 / 3.0 - hues[i]) * 6.0);
    }
    else {
      rgba[i] = p;
    }
  }
  return rgba;
}

vec4 rotateHue(vec4 rgba, float angle) {
  vec4 hsla = convertRgbToHsl(rgba);

  float h = mod(hsla.x + angle + 360.0, 360.0);

  return convertHslToRgb(vec4(h, hsla.yzw));
}

void main() {
  vec4 texel = texture2D(map, vUv);

  for (int i = 0; i < 3; i++) {
    vec2 center = bubbles[i].xy;
    float R = bubbles[i].z;
    float h = R / 2.0;
    vec2 direction = (vUv - center) * aspect;
    float r = length(direction);
    float alpha = atan(direction.y, direction.x);

    bool isBorder = abs(R - r) <= BORDER_WIDTH;

    bool isGlare = abs(R * GLARE_OFFSET_RATIO - r) <= BORDER_WIDTH
      && GLARE_ANGLE.x <= alpha
      && alpha <= GLARE_ANGLE.y;

    if (isBorder || isGlare) {
      texel = mix(texel, BORDER_TEXEL, BORDER_TEXEL.a);
      break;
    }

    if (r <= R) {
      float hr = R * sqrt(1.0 - pow((R - h) / R, 2.0));
      vec2 new_xy = r < hr
        ? direction * (R - h) / sqrt(R * R - r * r)
        : direction;

      texel = texture2D(map, new_xy / aspect + center);
      break;
    }
  }

  gl_FragColor = rotateHue(texel, hueRotation);
}
