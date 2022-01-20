import {Scene} from 'scenes/scene';

import blob from './blob';
import animalOnIce from './animal-on-ice';
import tree1 from './tree1';
import tree2 from './tree2';
import snow1 from './snow1';
import snow2 from './snow2';
import plane from './plane';

export default new Scene({
  container: document.querySelector(`.result--trip`),
  canvas: document.querySelector(`.result--trip canvas`),
  zoom: 400,
  shouldRenderAxes: false,
  animationProps: {
    duration: Infinity,
  },
  objects: [
    blob,
    tree1,
    tree2,
    animalOnIce,
    plane,
    snow1,
    snow2,
  ],
});
