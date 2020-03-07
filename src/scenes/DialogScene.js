import Phaser from 'phaser';
import {DialogModalPlugin} from '../plugins/DialogModalPlugin'
import Dialogs from '../assets/dialogs/dialogs.json'
import kyci from '../assets/images/kyci.png';
import penka from '../assets/images/penka.png';

export class DialogScene extends Phaser.Scene {
    constructor() {
        super({key: 'DialogScene'});
    }

    preload() {
        this.load.scenePlugin('DialogModalPlugin', DialogModalPlugin);
        // this.load.image('scene1', scene1);
        this.load.image('kyciAvatar1', kyci);
        this.load.image('penkaAvatar1', penka);
    }

    create(opts) {
        this.scene.setVisible(false);

        //get image by key
        // this.add.image(0, 0, opts.action).setOrigin(0, 0);
        this.add.image(0, 0, 'kyciAvatar1').setOrigin(0, 0);
        this.add.image(200, 200, 'penkaAvatar1').setOrigin(0, 0);

        this.dialog = Dialogs['scene1'];
        // this.dialog = Dialogs[opts.action];

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