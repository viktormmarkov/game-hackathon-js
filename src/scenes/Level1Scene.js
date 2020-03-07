import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import hitzone from '../assets/images/hitzone.png';

import {config} from '../index';
const enemyXY = [{x: 50, y: 50}, {x: 100, y:100}, {x: 200, y:100}]
export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.load.image('hitzone', hitzone);
        this.projectionAngle = Math.PI / 6;
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
        this.delta = {
            x: 60,
            y: 60
        }
        this.enemies = [];
        this.enemiesGroup = this.physics.add.group();
        // this.events.on('wake', () => this.createEnemies());
        this.createEnemies();
              
  
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

    createEnemies(sprite = 'misa-front') {
        for (let i = 0; i < this.enemiesCount; i ++) {
            const enemy = this.physics.add
                .sprite(enemyXY[i].x, enemyXY[i].y, "atlas", sprite)
                .setSize(30, 40)
                .setOffset(0, 24)
                .setDepth(config.playerDepth);
            enemy.body.immovable = true;
            enemy.lastHit = 0;
            enemy.damage = 2.5;
            enemy.health = 40;
            enemy.on('destroy', () => {
                const sumX = this.player.x > enemy.x ? -20 : 20;
                const sumY = this.player.y > enemy.y ? -20 : 20;
                this.powerup = this.physics.add.sprite(enemy.x + sumX * (Math.random()), enemy.y + sumY * (Math.random()) , 'hitzone');

                // const powerup = this.add.sprite(enemy.x, enemy.y, 'hitzone').setOrigin(0.5, 0.5);
                console.log(this.player);
                this.physics.add.collider(this.powerup, this.player, () => {
                    console.log('overlaaap');
                    this.player.health = 0;
                });
            })
            this.enemiesGroup.add(enemy);
            this.enemies.push(enemy);
        }
        this.physics.add.collider(this.enemiesGroup, this.player);
        this.physics.add.collider(this.enemiesGroup, this.enemiesGroup);
        this.physics.add.collider(this.enemiesGroup, this.worldLayer);
    }

    playerEnemyDelta(enemy) {
        return Math.abs(this.player.x - enemy.x) > this.delta.x ||
            Math.abs(this.player.y - enemy.y) > this.delta.y;
    }

    followPlayer(enemy) {
        const speed = config.enemySpeed;

        enemy.body.setVelocity(0);

        if (this.player.x >= enemy.x) {
            enemy.body.setVelocityX(speed);
        } else {
            enemy.body.setVelocityX(-speed);
        }
      
        if (this.player.y >= enemy.y) {
            enemy.body.setVelocityY(speed);
        } else {
            enemy.body.setVelocityY(-speed);
        }
        const deltaX = Math.abs(this.player.x - enemy.x);
        const deltaY = Math.abs(this.player.y - enemy.y);
        if (deltaX >= deltaY) {
            if (this.player.x >= enemy.x) {
                enemy.anims.play("misa-right-walk", true);
            } else if (this.player.x < enemy.x){
                enemy.anims.play("misa-left-walk", true);
            } else {
                enemy.anims.stop();
            }
        } else {
            if (this.player.y >= enemy.y) {
                enemy.anims.play("misa-front-walk", true);
            } else if (this.player.y < enemy.y){
                enemy.anims.play("misa-back-walk", true);
            } else {
                enemy.anims.stop();
            }
        }
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        enemy.body.velocity.normalize().scale(speed);
    }

    hitPlayer(enemy, player, time) {
        if (enemy.active === false) {
            return;
        }
        if ((time - enemy.lastHit) > 1000) {
            enemy.lastHit = time;
            // Get bullet from bullets group
            player.health -= enemy.damage;
        }
    }

    update(time) { 
        if (this.player.health <= 0) {
            this.scene.start('EndGame');
        }
        this.enemies.forEach(enemy => {
            if (enemy.health <= 0) {
                enemy.destroy(); 
            } else {
                if ( this.playerEnemyDelta(enemy) ) {
                    this.followPlayer(enemy);
                } else {
                    this.hitPlayer(enemy, this.player, time);
                }
            }
        });

        this.enemies = this.enemies.filter(e => e.health > 0)
        // if (this.hitzone) {
        //     this.hitzone.destroy();
        // }
        // if (this.enemies.length === 0) {
        //     this.scene.start('EndGame');
        // }
        super.update();
    }
}