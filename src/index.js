import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import * as _ from 'lodash';
import { FirstScene } from "./scenes/FirstScene";

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [FirstScene]
};

const game = new Phaser.Game(config);

