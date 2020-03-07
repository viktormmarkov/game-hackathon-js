import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';

import {config} from '../index';
const enemyXY = [{x: 50, y: 50}, {x: 100, y:100}, {x: 200, y:100}]
export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.projectionAngle = Math.PI / 6;
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });
        this.enemiesCount = 1;
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
        this.polygonGroup = this.physics.add.group();
        // this.physics.add.overlap(this.polygonGroup, this.enemyGroup, (obj1, obj2) => {
        //         obj1.destroy();
        //         obj2.destroy();
        //   });
              
        this.input.keyboard.on('keydown_SPACE', event => {
            const player = this.player;
            const range = 20;
            const radius = 30;
            const direction = player.direction;
            const initialy = player.y - 100 // uglyhack;
            const x = direction.x ? player.x + range * direction.x : player.x;
            const y = initialy ? initialy + range * direction.y : initialy;
            const polygonPoints = [x,y, x + radius,y, x + radius,y + radius, x, y + radius];
            const polygon = this.add.polygon(0, 100, polygonPoints, 0xff0000, 0.3).setDepth(config.playerDepth).setInteractive(true);
            this.physics.add.overlap(polygon, this.enemyGroup, (obj1, obj2) => {
                obj1.destroy();
                obj2.destroy();
                console.log('aaa');
            }, null, this);
              
          });
  
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
      
        // Vertical movement
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
        if (enemy.active === false)
        {
            return;
        }
    
        if ((time - enemy.lastHit) > 1000)
        {
            enemy.lastHit = time;
    
            // Get bullet from bullets group
            player.health -= enemy.damage;
        }
    }

    update(time) { 
        if (this.player.health <= 0) {
            this.scene.start('EndGame');
        }
        for (let i in this.enemies) {
            const enemy = this.enemies[i];
            if ( this.playerEnemyDelta(enemy) ) {
                this.followPlayer(enemy);
            } else {
                enemy.anims.stop();
                this.hitPlayer(enemy, this.player, time);
            }
        }
        
        super.update();
    }
}