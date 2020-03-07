import Phaser from 'phaser';

export class EndGame extends Phaser.Scene {
    constructor() {
        super({key: 'EndGame'})
    }
    create() {
        this.add.text(100, 100, 'Game Over');
        this.backButton = this.add.text(0, 0, '<- Back').setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        })
    }
}