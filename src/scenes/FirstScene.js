import Phaser from 'phaser'
import _ from 'lodash';
import { config } from '../index';

const fontSize = 25;
const menuItemStyle = {fontSize: `${fontSize}px`};

const MENU_ITEMS = [{
    text: 'Start Game',
    key: 'startGame'
}, {
    text: 'Options',
    key: 'options'
}];

export class FirstScene extends Phaser.Scene {
    constructor() {
        super({key: 'FirstScene'});
    }
    preload() {
        this.load.image('background', 'assets/images/background.jpg');
    }
    create() {
        this.background = this.add.tileSprite(0, 0,  config.width, config.height, 'background');
        this.background.setOrigin(0, 0);
        this.createMenu();
    }

    createMenu() {
        const x = this.game.renderer.width / 2;
        const y = this.game.renderer.height * 0.6;
        this.menuItems = MENU_ITEMS.map((item, index) => {
            const offset = index * fontSize * 1.2;
            return this.add.text(x, y + offset, item.text, menuItemStyle)
                .setOrigin(0.5, 0.5);
        });
    }
    update() {
        this.background.tilePositionY -= 0.5;
    }
}