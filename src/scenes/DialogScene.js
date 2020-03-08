import Phaser from 'phaser';
import {DialogModalPlugin} from '../plugins/DialogModalPlugin'
import Dialogs from '../assets/dialogs/dialogs.json'
import kyci from '../assets/images/Kyci.png';
import penka from '../assets/images/Penka.png';
import penka2 from '../assets/images/Penka2.png';
import bratuto from '../assets/images/BratutoBig.png';
import scene1 from '../assets/images/dialog_scene_1.png';

export class DialogScene extends Phaser.Scene {
    constructor() {
        super({key: 'DialogScene'});
    }

    preload() {
        this.load.scenePlugin('DialogModalPlugin', DialogModalPlugin);
        this.load.image('scene1', scene1);
        this.load.image('kyciAvatar1', kyci);
        this.load.image('penkaAvatar1', penka);
        this.load.image('penka2Avatar1', penka2);
        this.load.image('bratutoAvatar1', bratuto);
    }

    create(opts) {
        if (!opts.action) {
            opts.action = 'pre_scene1';
            opts.nextSceneKey = 'Level1Scene';
        }
        this.scene.setVisible(false);

        //get image by key
        this.add.image(0, 0, opts.action).setScale(2,2).setOrigin(0, 0);
        this.characters = {};
        
        Dialogs[opts.action].forEach(element => {
            let alpha = 0.6;
            if (Object.keys(this.characters).length === 0) {
                alpha = 1;
            }
            if (!this.characters[element.character]) {
                this.characters[element.character] = this.add.sprite(1000 * Object.keys(this.characters).length, 0, element.character + 'Avatar1')
                                                                .setScale(4, 4)
                                                                .setOrigin(0, 0)
                                                                .setAlpha(alpha);
            }
        });
        // this.characters['kyci'] = this.add.sprite(0, 0, 'kyciAvatar1').setScale(4, 4).setOrigin(0, 0).setAlpha(0.6);
        // this.characters['penka'] = this.add.sprite(1000, 0, 'penkaAvatar1').setScale(4, 4).setOrigin(0, 0);

        // this.dialog = Dialogs['scene1'];
        this.dialog = Dialogs[opts.action];

        this.dialogIndex = 0;
        this.DialogModalPlugin.init();
        this.DialogModalPlugin.setDialog(this.dialog);
        this.DialogModalPlugin.setNextScene(opts.nextSceneKey);
        
        this.input.keyboard.on('keyup_SPACE', () => {
            if (this.scene !== null && this.scene.isVisible()) {
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