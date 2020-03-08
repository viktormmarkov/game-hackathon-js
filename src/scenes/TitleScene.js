import Phaser from 'phaser'
import _ from 'lodash';
import { config } from '../index';
import tilesetlocal from '../assets/images/tileset.png';
import charlocal_down from '../assets/images/Character_Down-Sheet.png';
import charlocal_up from '../assets/images/Character_Up-Sheet.png';
import charlocal_left from '../assets/images/Character_Left-Sheet.png';
import charlocal_right from '../assets/images/Character_Right-Sheet.png';

import charlocal_fight_down from '../assets/images/Character_SlashDownLeft-Sheet.png';
import charlocal_fight_up from '../assets/images/Character_SlashUpRight-Sheet.png';
import charlocal_fight_left from '../assets/images/Character_SlashUpLeft-Sheet.png';
import charlocal_fight_right from '../assets/images/Character_SlashDownRight-Sheet.png';
import kyci from '../assets/images/Kyci.png';
import penka from '../assets/images/Penka.png';
import slap from '../assets/audio/slap2.wav';
import grunt from '../assets/audio/grunt.wav';

import penkaDown from '../assets/images/Penka_Down-Sheet.png';
import penkaUp from '../assets/images/Penka_Up-Sheet.png';
import penkaLeft from '../assets/images/Penka_Left-Sheet.png';
import penkaRight from '../assets/images/Penka_Right-Sheet.png';

import penkaFightDown from '../assets/images/Penka_SlashDownLeft-Sheet.png';
import penkaFightUp from '../assets/images/Penka_SlashUpRight-Sheet.png';
import penkaFightLeft from '../assets/images/Penka_SlashUpLeft-Sheet.png';
import penkaFightRight from '../assets/images/Penka_SlashDownRight-Sheet.png';

import maplocal from '../assets/map.json';
import music from '../assets/audio/music.wav';


const fontSize = 25;
const menuItemStyle = {fontSize: `${fontSize}px`};

const MENU_ITEMS = [{
    text: 'Start Game',
    scene: 'Level1Scene'
}, {
    text: 'Credits',
    scene: 'CreditsScene'
}];

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});
    }
    preload() {
        this.load.image("tiles", tilesetlocal);
        this.load.tilemapTiledJSON("map", maplocal);
        this.load.image('kyciAvatar', kyci);
        this.load.image('penkaAvatar', penka);
        this.load.audio('slap', slap);
        this.load.audio('grunt', grunt);
        this.load.audio('music', music);
        // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
        // the player animations (walking left, walking right, etc.) in one image. For more info see:
        //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
        // If you don't use an atlas, you can do the same thing with a spritesheet, see:
        //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
        this.load.atlas("atlas", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json");
        this.load.spritesheet("sprCharDown", charlocal_down, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("sprCharUp", charlocal_up, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("sprCharLeft", charlocal_left, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("sprCharRight", charlocal_right, {frameWidth: 32, frameHeight: 42})

        this.load.spritesheet("sprCharFightDown", charlocal_fight_down, {frameWidth: 32, frameHeight: 44})
        this.load.spritesheet("sprCharFightUp", charlocal_fight_up, {frameWidth: 34, frameHeight: 44})
        this.load.spritesheet("sprCharFightLeft", charlocal_fight_left, {frameWidth: 34, frameHeight: 40})
        this.load.spritesheet("sprCharFightRight", charlocal_fight_right, {frameWidth: 34, frameHeight: 40})

        this.load.spritesheet("penkaDown", penkaDown, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("penkaUp", penkaUp, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("penkaLeft", penkaLeft, {frameWidth: 32, frameHeight: 42})
        this.load.spritesheet("penkaRight", penkaRight, {frameWidth: 32, frameHeight: 42})

        this.load.spritesheet("penkaFightDown", penkaFightDown, {frameWidth: 32, frameHeight: 44})
        this.load.spritesheet("penkaFightUp", penkaFightUp, {frameWidth: 34, frameHeight: 44})
        this.load.spritesheet("penkaFightLeft", penkaFightLeft, {frameWidth: 34, frameHeight: 40})
        this.load.spritesheet("penkaFightRight", penkaFightRight, {frameWidth: 34, frameHeight: 40})

        // this.load.image('background', background);
    }
    create() {

        // this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        // this.background.setOrigin(0, 0);
        this.createMenu();
    }

    createMenu() {
        const x = this.game.renderer.width / 2;
        const y = this.game.renderer.height * 0.6;
        this.menuItems = MENU_ITEMS.map((item, index) => {
            const offset = index * fontSize * 1.2;
            const menuItem = this.add.text(x, y + offset, item.text, menuItemStyle)
                .setOrigin(0.5, 0.5).setInteractive();
            menuItem.on("pointerover", () => {
                menuItem.setScale(1.2, 1.2);
            });
            menuItem.on("pointerout", () => {
                menuItem.setScale(0.8, 0.8);
            });
            menuItem.on("pointerdown", () => {
                this.scene.start(item.scene);
            });
            return menuItem;
        });
       
    }
    update() {
        // this.background.tilePositionY -= 0.5;
    }
}