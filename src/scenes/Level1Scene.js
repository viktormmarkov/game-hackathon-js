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
        this.enemiesCount = 5;
        this.createPlayer();
      
        const tileset = this.map.addTilesetImage("tileset", "tiles");
      
        this.belowLayer = this.map.createStaticLayer("bellow", tileset, 0, 0);
        this.worldLayer = this.map.createStaticLayer("world", tileset, 0, 0);
        this.aboveLayer = this.map.createStaticLayer("above", tileset, 0, 0);
        this.delta = {
            x: 30,
            y: 40
        }
        this.enemies = [];
        this.enemiesGroup = this.physics.add.group();
        this.events.on('wake', () => this.createEnemies());
              
  
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

        this.anims.create({
            key: 'penkaDown',
            frames: this.anims.generateFrameNumbers('penkaDown', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
        this.anims.create({
            key: 'penkaUp',
            frames: this.anims.generateFrameNumbers('penkaUp', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'penkaLeft',
            frames: this.anims.generateFrameNumbers('penkaLeft', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'penkaRight',
            frames: this.anims.generateFrameNumbers('penkaRight', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'penkaFightDown',
            frames: this.anims.generateFrameNumbers('penkaFightDown', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'penkaFightUp',
            frames: this.anims.generateFrameNumbers('penkaFightUp', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'penkaFightLeft',
            frames: this.anims.generateFrameNumbers('penkaFightLeft', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'penkaFightRight',
            frames: this.anims.generateFrameNumbers('penkaFightRight', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
    }

    update(time) { 
        super.update();
    }
}