import Phaser from "phaser";
import * as _ from 'lodash';
import { TitleScene } from "./scenes/TitleScene";
import { OptionsScene } from "./scenes/OptionsScene";
import { Level1Scene } from "./scenes/Level1Scene";
import { DialogScene } from "./scenes/DialogScene";

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [TitleScene, DialogScene, Level1Scene, OptionsScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // Top down game, so no gravity
    }
  }
};

const game = new Phaser.Game(config);

