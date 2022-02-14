import {Scene} from 'scenes/scene';
import {CompositeScene} from 'scenes/composite-scene';

import blob from './blob';
import animalOnIce from './animal-on-ice';
import tree1 from './tree1';
import tree2 from './tree2';
import snow1 from './snow1';
import snow2 from './snow2';
import plane from './plane';

const container = document.querySelector(`.result--trip`);

const foreground = new Scene({
  name: `sea-calf.foreground`,
  container,
  canvas: document.querySelector(`.result--trip .result__canvas--foreground`),
  zoom: 400,
  animationProps: {
    duration: 3000,
  },
  objects: [
    blob,
    tree1,
    tree2,
    animalOnIce,
    plane,
  ],
});

const background = new Scene({
  name: `sea-calf.background`,
  container,
  canvas: document.querySelector(`.result--trip .result__canvas--background`),
  zoom: 400,
  animationProps: {
    duration: Infinity,
  },
  objects: [
    snow1,
    snow2,
  ],
});

export default new CompositeScene([foreground, background]);
