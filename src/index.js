import Phaser from "phaser";
import * as _ from 'lodash';
import { TitleScene } from "./scenes/TitleScene";
import { OptionsScene } from "./scenes/OptionsScene";
import { MainScene } from "./scenes/MainScene";

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [TitleScene, MainScene, OptionsScene]
};

const game = new Phaser.Game(config);

