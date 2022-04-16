import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {ObjectName} from '3d/constants/object-name';
import {FrameAnimation} from 'helpers/frame-animation';
import {scaleObjectToFitHeight} from '3d/helpers/object-helpers';
import {createSineCalculator} from 'helpers/calculator';
import {convertToEaseInOut, easeInCubic, easeSine} from 'helpers/easings';

const COMPASS_URL = `./3d/module-6/rooms-scenes/objects/compass.gltf`;

const COMPASS = {
  height: 280,
  position: [-10, 0, 10],
  animation: {
    angle: 8,
    iterationDuration: 2500,
  },
};

export const addCompass = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(COMPASS_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.COMPASS;
      object.position.set(...COMPASS.position);
      scaleObjectToFitHeight(object, COMPASS.height);

      const arrowCenter = object.getObjectByName(ObjectName.COMPASS_ARROW_CENTER);

      const rotationZ = createSineCalculator({
        period: COMPASS.animation.iterationDuration,
        x: COMPASS.animation.iterationDuration / 4,
      });

      const easeRotation = convertToEaseInOut(easeInCubic);

      parent.add(object);
      return {
        object,
        animation: new FrameAnimation({
          delay: 1000,
          duration: Infinity,
          onRenderFrame({elapsed}) {
            const rotation = easeSine(rotationZ.calculateY(elapsed), easeRotation);
            arrowCenter.rotation.z = -THREE.MathUtils.degToRad(COMPASS.animation.angle * rotation);
          },
        }),
      };
    });
};
