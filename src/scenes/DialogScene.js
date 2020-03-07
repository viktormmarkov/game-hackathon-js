import Phaser from 'phaser';
import {DialogModalPlugin} from '../plugins/DialogModalPlugin'
import Dialogs from '../assets/dialogs/dialogs.json'
import scene1 from '../assets/images/dialog_scene_1.jpg'

export class DialogScene extends Phaser.Scene {
    constructor() {
        super({key: 'DialogScene'});
    }

    preload() {
        this.load.scenePlugin('DialogModalPlugin', DialogModalPlugin);
        this.load.image('scene1', scene1);
    }

    create(opts) {
        this.scene.setVisible(false);

        //get image by key
        this.add.image(0, 0, opts.action).setOrigin(0, 0);

        this.dialog = Dialogs[opts.action];
        this.dialogIndex = 0;
        this.DialogModalPlugin.init();
        this.DialogModalPlugin.setDialog(this.dialog);
        this.DialogModalPlugin.setNextScene(opts.nextSceneKey);
        
        this.input.keyboard.on('keyup_SPACE', () => {
            if (this.scene.scene !== null) {
                this.DialogModalPlugin.showNextText();
            }
        });

        this.scene.setVisible(true);
        this.cameras.main.fadeIn(1000);
    }
}