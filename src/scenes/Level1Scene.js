import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import {config} from '../index';
const enemyXY = [{x: 50, y: 50}, {x: 100, y:100}, {x: 200, y:100}]
export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }
    create() {
        this.map = this.make.tilemap({ key: "map" });
        this.enemiesCount = 3;
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
        this.delta = {
            x: 10,
            y: 10
        }
        this.enemies = [];
        this.enemiesGroup = this.physics.add.group();
        this.physics.add.collider(this.enemiesGroup, this.player, () => {
            // this.enemy.disableBody(true, false);
            console.log('aaa')
        });
        this.physics.add.collider(this.enemiesGroup, this.enemiesGroup);
        this.createEnemies();
    }

    createEnemies(sprite = 'misa-front') {
        for (let i = 0; i < this.enemiesCount; i ++) {
            const enemy = this.physics.add
                .sprite(enemyXY[i].x, enemyXY[i].y, "atlas", sprite)
                .setSize(30, 40)
                .setDepth(config.playerDepth);
            this.enemiesGroup.add(enemy);
            this.enemies.push(enemy);
        }
    }

    playerEnemyDelta(enemy) {
        return Math.abs(this.player.x - enemy.x) > this.delta.x || 
            Math.abs(this.player.y - enemy.y) > this.delta.y;
    }
    followPlayer(enemy) {
        const speed = config.enemySpeed;

        // enemy.body.setVelocity(0);

        if (this.player.x >= enemy.x) {
            enemy.body.setVelocityX(speed);
        } else {
            enemy.body.setVelocityX(-speed);
        }
      
        // Vertical movement
        if (this.player.y >= enemy.y) {
            enemy.body.setVelocityY(speed);

        } else {
            enemy.body.setVelocityY(-speed);
        }
      
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        enemy.body.velocity.normalize().scale(speed);
    }

    update() {
        for (let i in this.enemies) {
            if ( this.playerEnemyDelta(this.enemies[i])) {
                this.followPlayer(this.enemies[i]);
            }   
        }
        
        super.update();
    }
}