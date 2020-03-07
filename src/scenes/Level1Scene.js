import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import {config} from '../index';

export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }
    create() {
        this.map = this.make.tilemap({ key: "map" });

        this.createPlayer();
      
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = this.map.addTilesetImage("tileset", "tiles");
      
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.belowLayer = this.map.createStaticLayer("bellow", tileset, 0, 0);
        this.worldLayer = this.map.createStaticLayer("world", tileset, 0, 0);
        this.aboveLayer = this.map.createStaticLayer("above", tileset, 0, 0);
        super.create();

        const spawnPoint = {
            x: 352,
            y: 1216
        };
        this.enemy = this.physics.add
            .sprite(spawnPoint.x + 30, spawnPoint.y - 20, "atlas", "misa-front")
            .setSize(30, 40)
            .setDepth(8)
            .setOffset(0, 24);
        this.physics.add.collider(this.enemy, this.worldLayer);
        this.physics.add.collider(this.enemy, this.player, () => {
            this.enemy.disableBody(true, false);
            console.log('aaa')
        });
        // this.physics.add.overlap(this.enemy, this.player, () => {
        //     console.log('aaa')
        // });
        this.delta = {
            x: 10,
            y: 10
        } 
    }

    playerEnemyDelta(enemy) {
        return Math.abs(this.player.x - enemy.x) > this.delta.x || 
            Math.abs(this.player.y - enemy.y) > this.delta.y;
    }
    followPlayer() {
        const speed = config.enemySpeed;

        this.enemy.body.setVelocity(0);

        if (this.player.x >= this.enemy.x) {
            this.enemy.body.setVelocityX(speed);
        } else {
            this.enemy.body.setVelocityX(-speed);
        }
      
        // Vertical movement
        if (this.player.y >= this.enemy.y) {
            this.enemy.body.setVelocityY(speed);

        } else {
            this.enemy.body.setVelocityY(-speed);
        }
      
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.enemy.body.velocity.normalize().scale(speed);
    }

    update() {

        // this.enemy.body.setVelocity(0);
        
        if ( this.playerEnemyDelta(this.enemy)) {
            this.followPlayer();
        }   
        // Horizontal movement
       

        // const direction = Math.atan( (this.player.x-this.enemy.x) / (this.player.y-this.enemy.y));
        // const speed = 3;
        // let xSpeed, ySpeed;
        // // Calculate X and y velocity of bullet to moves it from shooter to target
        // if (this.player.y >= this.enemy.y) {
        //     xSpeed = speed * Math.sin(direction);
        //     ySpeed = speed * Math.cos(direction);
        // } else {
        //     xSpeed = -speed * Math.sin(direction);
        //     ySpeed = -speed * Math.cos(direction);
        // }
        // this.enemy.x += xSpeed * 1;
        // this.enemy.y += ySpeed * 1;
        super.update();
    }
}