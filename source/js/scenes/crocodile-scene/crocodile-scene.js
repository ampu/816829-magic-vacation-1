import {Scene} from 'scenes/scene';
import {CompositeScene} from 'scenes/composite-scene';

import lock from './lock';
import leaf from './leaf';
import snowflake from './snowflake';
import saturn from './saturn';
import watermelon from './watermelon';
import flamingo from './flamingo';
import crocodile from './crocodile';
import drop from './drop';

const foreground = new Scene({
  name: `crocodile.foreground`,
  canvas: document.querySelector(`.result--negative .result__canvas--foreground`),
  zoom: 400,
  animationProps: {
    duration: 3000,
  },
  objects: [
    lock,
    leaf,
    snowflake,
    saturn,
    watermelon,
    flamingo,
    crocodile,
  ],
});

const background = new Scene({
  name: `crocodile.background`,
  canvas: document.querySelector(`.result--negative .result__canvas--background`),
  zoom: 400,
  animationProps: {
    duration: Infinity,
  },
  objects: [
    drop,
  ],
});

export default new CompositeScene([foreground, background]);
