import Phaser from "phaser";
import * as _ from 'lodash';
import { TitleScene } from "./scenes/TitleScene";
import { OptionsScene } from "./scenes/OptionsScene";
import { Level1Scene } from "./scenes/Level1Scene";

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1088,
  height: 1088,
  scene: [TitleScene, Level1Scene, OptionsScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // Top down game, so no gravity
    },
  },
  // scale: {
  //   mode: Phaser.Scale.CENTER_BOTH,
  //   parent: 'phaser-example',
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: 1000,
  //   height: 1088,
  // }, 
  render: {
    pixelArt: true,
  },
  playerSpeed: 175,
  enemySpeed: 90,
  playerDepth: 9,
};

const game = new Phaser.Game(config);

