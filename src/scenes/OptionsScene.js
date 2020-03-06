import Phaser from 'phaser';

export class OptionsScene extends Phaser.Scene {
    constructor() {
        super({key: 'OptionsScene'})
    }
    create() {
        this.add.text(100, 100, 'Options');
        this.backButton = this.add.text(0, 0, '<- Back').setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        })
    }
}