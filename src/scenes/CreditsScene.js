import Phaser from 'phaser';
import credits from '../assets/images/credits.png';
import {config} from '../index';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({key: 'CreditsScene'})
    }
    preload() {
        this.load.image('credits', credits);
    }
    create() {
        this.add.sprite(0, 0, 'credits').setOrigin(0, 0).setSize(config.width, config.height); 
        console.log(this.game.width);
        this.backButton = this.add.text(0, 0, '<- Back').setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        })
    }
}