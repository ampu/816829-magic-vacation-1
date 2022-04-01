import * as THREE from 'three';

export const addLightGroup = (parent, {x, y, z}) => {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  parent.add(group);
  return group;
};

export const addHemisphereLight = (scene, parent, {x, y, z}) => {
  const light = new THREE.HemisphereLight(0xaaaaff, 0xaaffaa, 0.5);
  light.position.set(-x, -y, -z);
  parent.add(light);

  const helper = new THREE.HemisphereLightHelper(light, 50);
  scene.add(helper);

  return light;
};

export const addDirectionalLight = (scene, parent, {x, y, z}) => {
  const light = new THREE.DirectionalLight(`rgb(255, 255, 255)`, 0.84);
  light.target.position.set(-x, -y, -z);
  light.target.position.y -= z * Math.tan(THREE.MathUtils.degToRad(15));
  light.target.updateMatrixWorld();

  parent.add(light);
  parent.add(light.target);

  const helper = new THREE.DirectionalLightHelper(light, 50);
  scene.add(helper);

  return light;
};

export const addPointLight1 = (scene, parent) => {
  const light = new THREE.PointLight(`rgb(246, 242, 255)`, 0.6, 1975, 2.0);
  light.position.x -= 785;
  light.position.y -= 350;
  light.position.z -= 710;
  parent.add(light);

  const helper = new THREE.PointLightHelper(light, 50);
  scene.add(helper);

  return light;
};

export const addPointLight2 = (scene, parent) => {
  const light = new THREE.PointLight(`rgb(245, 254, 255)`, 0.95, 1975, 2.0);
  light.position.x += 730;
  light.position.y += 800;
  light.position.z -= 985;
  parent.add(light);

  const helper = new THREE.PointLightHelper(light, 50);
  scene.add(helper);

  return light;
};