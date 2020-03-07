import Phaser from 'phaser';
import { GameSceneBase } from './GameSceneBase';

export class DialogScene extends GameSceneBase {
    constructor() {
        super({key: 'DialogScene'})
    }
    create() {
        this.add.text(100, 100, 'Options');
        this.backButton = this.add.text(0, 0, '<- Back').setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        })
    }
}