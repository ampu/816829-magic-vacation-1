import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {FrameAnimation} from 'helpers/frame-animation';
import {createRangesCalculator, multiplyRanges} from 'helpers/calculator';
import {easeInOutSine} from 'helpers/easings';

import {ObjectName} from '3d/constants/object-name';
import {rotateObjectInDegrees} from '3d/helpers/object-helpers';

const DOG_URL = `./3d/module-6/rooms-scenes/objects/dog.gltf`;

const DOG = {
  position: [500, 0, 440],
  rotation: [0, 60, 0, `XYZ`],
  durationRatio: 4,
  iterationDuration: 1400,
};

export const addDog = (parent) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(DOG_URL, resolve, null, reject);
  })
    .then((gltf) => {
      /** @param {Group} object */
      const object = gltf.scene;
      object.name = ObjectName.DOG;
      object.position.set(...DOG.position);
      rotateObjectInDegrees(object, DOG.rotation);

      const tail = object.getObjectByName(ObjectName.DOG_TAIL);

      const getTailRotationX = createRangesCalculator(multiplyRanges([
        {xRange: [0, 40], yRange: [0, -22], onProgress: easeInOutSine},
        {xRange: [40, 120], yRange: [-22, 25]},
        {xRange: [120, 160], yRange: [25, -25]},
        {xRange: [160, 200], yRange: [-25, 22]},
        {xRange: [200, 240], yRange: [22, -25]},
        {xRange: [240, 280], yRange: [-25, 22]},
        {xRange: [280, 320], yRange: [22, -25], onProgress: easeInOutSine},
        {xRange: [320, 400], yRange: [-25, 0], onProgress: easeInOutSine},
        {xRange: [400, 750], yRange: [0, -22], onProgress: easeInOutSine},
        {xRange: [750, 840], yRange: [-22, 25], onProgress: easeInOutSine},
        {xRange: [840, 880], yRange: [25, -25]},
        {xRange: [880, 920], yRange: [-25, 22]},
        {xRange: [920, 960], yRange: [22, -25]},
        {xRange: [960, 1000], yRange: [-25, 22]},
        {xRange: [1000, 1040], yRange: [22, -25]},
        {xRange: [1040, 1080], yRange: [-25, 0]},
        {xRange: [1080, 1140], yRange: [0, -25]},
        {xRange: [1140, 1180], yRange: [-25, 22]},
        {xRange: [1180, 1220], yRange: [22, -25]},
        {xRange: [1220, 1270], yRange: [-25, 22]},
        {xRange: [1270, 1310], yRange: [22, -25]},
        {xRange: [1310, 1390], yRange: [-25, 0], onProgress: easeInOutSine},
      ], DOG.durationRatio));

      parent.add(object);
      return {
        object,
        animation: new FrameAnimation({
          delay: 1700,
          duration: Infinity,
          onRenderFrame({elapsed}) {
            const iterationDuration = DOG.iterationDuration * DOG.durationRatio;
            tail.rotation.x = THREE.MathUtils.degToRad(getTailRotationX(elapsed % iterationDuration));
          },
        }),
      };
    });
};
