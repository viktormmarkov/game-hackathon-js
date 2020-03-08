import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import hitzone from '../assets/images/hitzone.png';
import tombstone from '../assets/images/tombstone.png';


import {config} from '../index';
const enemyXY = [{x: 50, y: 50}, {x: 100, y:100}, {x: 200, y:100}];
const fontStyle = {
    fontSize: '25px',
    // color: "#ff0000"
}

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
            x: 30,
            y: 40
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

    dropPowerups(enemy) {
        const sumX = this.player.x > enemy.x ? -20 : 20;
        const sumY = this.player.y > enemy.y ? -20 : 20;
        this.physics.add.sprite(enemy.x, enemy.y, 'tombstone');
        const powerup = this.physics.add.sprite(enemy.x + sumX * (Math.random()), enemy.y + sumY * (Math.random()) , 'hitzone');

        // const powerup = this.add.sprite(enemy.x, enemy.y, 'powerup').setOrigin(0.5, 0.5);
        this.physics.add.overlap(powerup, this.player, (powerup) => {
            powerup.destroy();
            const text = this.add.text(powerup.x, powerup.y, '+10dmg', fontStyle).setOrigin(0.5, 0.5)
            this.tweens.add({
                targets: text,  
                scale: { from: 1, to: 0},
                y: { from: text.y, to: text.y - 50},
                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 400,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        });
    }

    createEnemies(sprite = 'misa-front') {
        for (let i = 0; i < this.enemiesCount; i ++) {
            const enemy = this.physics.add
                .sprite(enemyXY[i].x, enemyXY[i].y, "penkaLeft", 0)
                .setSize(30, 40)
                .setOffset(0, 0)
                .setDepth(config.playerDepth);
            enemy.body.immovable = true;
            enemy.lastHit = 0;
            enemy.damage = 2.5;
            enemy.health = 40;
            enemy.on('destroy', () => {
                this.dropPowerups(enemy);
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
        
        if (enemy.isHitting) {
            return;
        }
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
                enemy.anims.play("penkaRight", true, 0);
            } else if (this.player.x < enemy.x){
                enemy.anims.play("penkaLeft", true, 0);
            } else {
                enemy.anims.stop();
            }
        } else {
            if (this.player.y >= enemy.y) {
                enemy.anims.play("penkaDown", true, 0);
            } else if (this.player.y < enemy.y){
                enemy.anims.play("penkaUp", true, 0);
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
            const enemyXY = enemy.getCenter();
            const playerXY = this.player.getCenter();
            const xDif = enemyXY.x - playerXY.x;
            const yDif = enemyXY.y - playerXY.y;
            enemy.isHitting = true;
            if (Math.abs(xDif) > Math.abs(yDif)) {
                if (xDif < 0) {
                    enemy.anims.play("penkaFightRight", true, 0);
                } else {
                    enemy.anims.play("penkaFightLeft", true, 0);
                }
            } else {
                if (yDif > 0) {
                    enemy.anims.play("penkaFightUp", true, 0);
                } else {
                    enemy.anims.play("penkaFightDown", true, 0);                    
                }
                
            }
            enemy.lastHit = time;
            // Get bullet from bullets group
            player.health -= enemy.damage;
            this.sound.play('grunt');
        }

        if ((time - enemy.lastHit) >= 200 && enemy.isHitting) {
            enemy.isHitting = false;
            enemy.anims.stop();
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
                    if (!enemy.isHitting) {
                        this.followPlayer(enemy);
                    }
                } else {
                    this.hitPlayer(enemy, this.player, time);
                    enemy.setVelocity(0);
                }
                if ((time - enemy.lastHit) >= 200 && enemy.isHitting) {
                    enemy.isHitting = false;
                    enemy.anims.stop();
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