import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {ObjectName} from '3d/constants/object-name';
import {rotateObjectInDegrees, wrapObject} from '3d/helpers/object-helpers';

import {FrameAnimation} from 'helpers/frame-animation';
import {createSineCalculator} from 'helpers/calculator';

const SONYA_URL = `./3d/module-6/rooms-scenes/objects/sonya.gltf`;

const SONYA = {
  position: [400, 100, 300],
  rotation: [0, 10, 0, `XYZ`],
  animation: {
    iterationDuration: 1200,
    heightAmplitude: 20,
    angleAmplitude: 6,
  },
};

export const addSonya = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(SONYA_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.SONYA;
      object.position.set(...SONYA.position);
      rotateObjectInDegrees(object, SONYA.rotation);

      const wrapper = wrapObject(object);

      const sineCalculator = createSineCalculator({x: 3 / 4});

      const leftHand = object.getObjectByName(ObjectName.SONYA_LEFT_HAND);
      const startLeftHandRotationY = leftHand.rotation.y;

      const rightHand = object.getObjectByName(ObjectName.SONYA_RIGHT_HAND);
      const startRightHandRotationY = rightHand.rotation.y;

      parent.add(wrapper);
      return {
        object,
        animation: new FrameAnimation({
          delay: 1000,
          duration: Infinity,
          onRenderFrame({elapsed}) {
            const sine = sineCalculator.calculateY(elapsed % SONYA.animation.iterationDuration / SONYA.animation.iterationDuration);
            const rotation = THREE.MathUtils.degToRad(sine * SONYA.animation.angleAmplitude / 2);

            wrapper.position.y = sine * SONYA.animation.heightAmplitude / 2;
            leftHand.rotation.y = startLeftHandRotationY + rotation;
            rightHand.rotation.y = startRightHandRotationY - rotation;
          },
        })
      };
    });
};
