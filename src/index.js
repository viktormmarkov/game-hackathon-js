import Phaser from "phaser";
import * as _ from 'lodash';
import { TitleScene } from "./scenes/TitleScene";
import { CreditsScene } from "./scenes/CreditsScene";
import { Level1Scene } from "./scenes/Level1Scene";
import { Level2Scene } from "./scenes/Level2Scene";
import { DialogScene } from "./scenes/DialogScene";
import { EndGame } from "./scenes/EndGame";


export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1802,
  height: 1020,
  scene: [TitleScene, DialogScene, Level1Scene, Level2Scene, CreditsScene, EndGame],
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

