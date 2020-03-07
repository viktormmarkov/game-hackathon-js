import Phaser from 'phaser';
import {DialogModalPlugin} from '../plugins/DialogModalPlugin'

export class DialogScene extends Phaser.Scene {
    constructor() {
        super({key: 'DialogScene'});
    }

    preload() {
        this.load.scenePlugin('DialogModalPlugin', DialogModalPlugin);
    }

    create(opts) {
        this.add.image(0, 0, opts.image).setOrigin(0, 0);

        this.dialog = opts.dialog.dialog;
        this.dialogIndex = 0;
        this.DialogModalPlugin.init();
        this.DialogModalPlugin.setDialog(this.dialog);
        this.DialogModalPlugin.setNextScene(this.scene, opts.nextSceneKey);

        this.input.keyboard.on('keydown_SPACE', event => {
           this.DialogModalPlugin.showNextText();
        });
    }
}