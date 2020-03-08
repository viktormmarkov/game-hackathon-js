import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import hitzone from '../assets/images/hitzone.png';
import tombstone from '../assets/images/tombstone.png';
import {config} from '../index';

export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.load.image('hitzone', hitzone);
        this.load.image('tombstone', tombstone);
        this.projectionAngle = Math.PI / 6;
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });
        this.enemiesCount = 1;
        this.createPlayer();
      
        const tileset = this.map.addTilesetImage("tileset", "tiles");
      
        this.belowLayer = this.map.createStaticLayer("bellow", tileset, 0, 0);
        this.worldLayer = this.map.createStaticLayer("world", tileset, 0, 0);
        this.aboveLayer = this.map.createStaticLayer("above", tileset, 0, 0);

        this.enemies = [];
        this.enemiesGroup = this.physics.add.group();
        this.events.on('wake', () => this.createEnemies('penka2', 1, 5, 30, 30, 40));
              
  
        this.input.keyboard.once("keydown_D", event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();
    
        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20);
        this.worldLayer.renderDebug(graphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        });
  
        super.create();
    }
}