import Phaser from 'phaser';
import {DialogModalPlugin} from '../plugins/DialogModalPlugin'
import Dialogs from '../assets/dialogs/dialogs.json'
import kyci from '../assets/images/Kyci.png';
import penka from '../assets/images/Penka.png';

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
        this.characters = {
            'kyci': this.add.sprite(0, 0, 'kyciAvatar1').setOrigin(0, 0),
            'penka': this.add.sprite(200, 0, 'penkaAvatar1').setOrigin(0, 0)
        }

        this.dialog = Dialogs['scene1'];
        // this.dialog = Dialogs[opts.action];

        this.dialogIndex = 0;
        this.DialogModalPlugin.init();
        this.DialogModalPlugin.setDialog(this.dialog);
        this.DialogModalPlugin.setNextScene(opts.nextSceneKey);
        
        this.input.keyboard.on('keyup_SPACE', () => {
            if (this.scene.scene !== null) {
                const prevIndex = this.DialogModalPlugin.getDialogIndex();
                this.DialogModalPlugin.showNextText();
                const index = this.DialogModalPlugin.getDialogIndex();
                const currentc = this.dialog[index].character;
                const previousc =  this.dialog[prevIndex].character
                this.characters[currentc].setAlpha(1);
                this.characters[previousc].setAlpha(0.6);
            }
        });

        this.scene.setVisible(true);
        this.cameras.main.fadeIn(1000);
    }
}