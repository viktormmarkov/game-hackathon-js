import Phaser from 'phaser'
import _ from 'lodash';
import { config } from '../index';
import background from '../assets/images/logo.png';

const fontSize = 25;
const menuItemStyle = {fontSize: `${fontSize}px`};

const MENU_ITEMS = [{
    text: 'Start Game',
    scene: 'MainScene'
}, {
    text: 'Options',
    scene: 'OptionsScene'
}];

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'});
    }
    preload() {
        this.load.image('background', background);
    }
    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.background.setOrigin(0, 0);
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
        this.background.tilePositionY -= 0.5;
    }
}