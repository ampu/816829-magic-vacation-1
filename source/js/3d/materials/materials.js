import * as THREE from 'three';

export const Color = {
  BLUE: `rgb(51, 113, 235)`,
  BRIGHT_BLUE: `rgb(47, 58, 201)`,
  LIGHT_BLUE: `rgb(150, 176, 243)`,
  DARK_BLUE: `rgb(12, 49, 112)`,
  SKY_LIGHT_BLUE: `rgb(161, 200, 240)`,
  MOUNTAIN_BLUE: `rgb(101, 152, 219)`,
  DOMINANT_RED: `rgb(255, 32, 66)`,
  LIGHT_DOMINANT_RED: `rgb(255, 105, 120)`,
  SHADOWED_DOMINANT_RED: `rgb(124, 26, 48)`,
  PURPLE: `rgb(163, 118, 235)`,
  BRIGHT_PURPLE: `rgb(118, 76, 225)`,
  LIGHT_PURPLE: `rgb(194, 153, 225)`,
  ADDITIONAL_PURPLE: `rgb(119, 85, 189)`,
  DARK_PURPLE: `rgb(76, 49, 121)`,
  SHADOWED_PURPLE: `rgb(75, 50, 116)`,
  SHADOWED_BRIGHT_PURPLE: `rgb(56, 37, 108)`,
  SHADOWED_LIGHT_PURPLE: `rgb(77, 53, 106)`,
  SHADOWED_ADDITIONAL_PURPLE: `rgb(55, 38, 89)`,
  SHADOWED_DARK_PURPLE: `rgb(49, 42, 71)`,
  GREY: `rgb(118, 125, 143)`,
  METAL_GREY: `rgb(126, 141, 164)`,
  ORANGE: `rgb(230, 80, 0)`,
  GREEN: `rgb(0, 210, 134)`,
  WHITE: `rgb(255, 255, 255)`,
  SNOW: `rgb(182, 206, 240)`,
};

export const Reflection = {
  SOFT: {
    roughness: 0.55,
    side: THREE.DoubleSide,
  },
  BASIC: {
    roughness: 0.5,
    side: THREE.DoubleSide,
  },
  STRONG: {
    roughness: 0.4,
    side: THREE.DoubleSide,
  },
};

export const Material = {
  SOFT_BLUE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.BLUE}),
  SOFT_LIGHT_BLUE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.LIGHT_BLUE}),
  SOFT_SKY_LIGHT_BLUE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.SKY_LIGHT_BLUE}),
  SOFT_BRIGHT_BLUE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.BRIGHT_BLUE}),
  SOFT_MOUNTAIN_BLUE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.MOUNTAIN_BLUE}),
  SOFT_ORANGE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.ORANGE}),
  SOFT_DOMINANT_RED: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.DOMINANT_RED}),
  SOFT_PURPLE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.PURPLE}),
  SOFT_BRIGHT_PURPLE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.BRIGHT_PURPLE}),
  SOFT_METAL_GREY: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.METAL_GREY}),
  SOFT_SHADOWED_DOMINANT_RED: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.SHADOWED_DOMINANT_RED}),
  SOFT_SHADOWED_BRIGHT_PURPLE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.SHADOWED_BRIGHT_PURPLE}),
  SOFT_SHADOWED_DARK_PURPLE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.SHADOWED_DARK_PURPLE}),
  SOFT_DARK_PURPLE: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.DARK_PURPLE}),
  SOFT_LIGHT_DOMINANT_RED: new THREE.MeshStandardMaterial({...Reflection.SOFT, color: Color.LIGHT_DOMINANT_RED}),
  BASIC_PURPLE: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.PURPLE}),
  BASIC_SHADOWED_PURPLE: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.SHADOWED_PURPLE}),
  BASIC_BLUE: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.BLUE}),
  BASIC_GREEN: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.GREEN}),
  BASIC_WHITE: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.WHITE}),
  BASIC_GREY: new THREE.MeshStandardMaterial({...Reflection.BASIC, color: Color.GREY}),
  STRONG_SNOW: new THREE.MeshStandardMaterial({...Reflection.STRONG, color: Color.SNOW}),
};
