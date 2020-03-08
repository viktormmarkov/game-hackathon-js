import Phaser from 'phaser';
import { config } from '../index'

const POWERUP_TYPES = ['damage', 'speed', 'health'];
const POWERUP_MODIFIERS = [5, 10, 20, 50, -5, -10, -20, -50];
const POWERUP_MODIFIERS_COUNT = POWERUP_MODIFIERS.length;
const POWERUPS_TYPES_COUNT = POWERUP_TYPES.length;

function getPowerup () {
    const powerupIndex = Math.floor(Math.random() *  POWERUPS_TYPES_COUNT);
    const modifierIndex = Math.floor(Math.random() *  POWERUP_MODIFIERS_COUNT);
    const type = POWERUP_TYPES[powerupIndex];
    const modifier = POWERUP_MODIFIERS[modifierIndex];
    const isPositive = modifier > 0;
    return {
        type,
        modifier,
        text: `${isPositive ? '+' : '-'}${Math.abs(modifier)}${type}`,
        color: isPositive ? '#639d02' : '#9b1c31'
    }
}

export class GameSceneBase extends Phaser.Scene {
    constructor(key) {
      super({key})
    }
   
    preload() {
    }

    create() {
        this.lifeBar = this.add.graphics(0, 0).setDepth(11)
        this.lifeBarBg = this.add.graphics(0, 0).setDepth(10);
        this.avatar = this.add.image(50, 50, 'kyciAvatar').setScale(0.3, 0.3).setOrigin(0.5, 0.5).setDepth(12);

        this.worldLayer.setCollisionByProperty({ collides: true });

        this.scene.setVisible(true);
        this.cameras.main.fadeIn(1000);
        setTimeout(() => {
          // By default, everything gets depth sorted on the screen in the order we created things. Here, we
          // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
          // Higher depths will sit on top of lower depth objects.
          this.aboveLayer.setDepth(10);
        }, 1000);

        // Watch the player and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.player, this.worldLayer);

        const indexes = this.worldLayer.getTilesWithin().filter(tile => tile.properties.collides).map(tile => tile.index);
        this.worldLayer.setTileIndexCallback(indexes, (player, tile) => {
            if (tile.properties.action && tile.properties.action.indexOf('scene') > -1) {
                const currentKey = this.scene.key;
                this.scene.sleep(currentKey);
                this.resetMovementButtons();
                this.scene.launch('DialogScene', {action: tile.properties.action, nextSceneKey: currentKey})
            }
            delete tile.properties.action;
        }); 
        this.delta = {
          x: 40,
          y: 50
      }
        // Create the player's walking animations from the texture atlas. These are stored in the global
        // animation manager so any sprite can access them.
        const anims = this.anims;
        anims.create({
          key: "misa-left-walk",
          frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "misa-right-walk",
          frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "misa-front-walk",
          frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
          frameRate: 10,
          repeat: -1
        });
        anims.create({
          key: "misa-back-walk",
          frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
          frameRate: 10,
          repeat: -1
        });

        // Kyci animations
        this.anims.create({
          key: 'kyciDown',
          frames: this.anims.generateFrameNumbers('sprCharDown', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'kyciUp',
          frames: this.anims.generateFrameNumbers('sprCharUp', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'kyciLeft',
          frames: this.anims.generateFrameNumbers('sprCharLeft', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
        this.anims.create({
          key: 'kyciRight',
          frames: this.anims.generateFrameNumbers('sprCharRight', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'kyciFightDown',
          frames: this.anims.generateFrameNumbers('sprCharFightDown', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: 0
        });
        this.anims.create({
          key: 'kyciFightUp',
          frames: this.anims.generateFrameNumbers('sprCharFightUp', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: 0
        });
        this.anims.create({
          key: 'kyciFightLeft',
          frames: this.anims.generateFrameNumbers('sprCharFightLeft', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: 0
        });
        this.anims.create({
          key: 'kyciFightRight',
          frames: this.anims.generateFrameNumbers('sprCharFightRight', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: 0
        });
      

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


      this.anims.create({
        key: 'penka2Down',
        frames: this.anims.generateFrameNumbers('penka2Down', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    this.anims.create({
        key: 'penka2Up',
        frames: this.anims.generateFrameNumbers('penka2Up', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'penka2Left',
        frames: this.anims.generateFrameNumbers('penka2Left', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'penka2Right',
        frames: this.anims.generateFrameNumbers('penka2Right', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'penka2FightDown',
        frames: this.anims.generateFrameNumbers('penka2FightDown', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'penka2FightUp',
        frames: this.anims.generateFrameNumbers('penka2FightUp', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'penka2FightLeft',
        frames: this.anims.generateFrameNumbers('penka2FightLeft', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'penka2FightRight',
        frames: this.anims.generateFrameNumbers('penka2FightRight', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
      key: 'bratutoDown',
      frames: this.anims.generateFrameNumbers('bratutoDown', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  this.anims.create({
      key: 'bratutoUp',
      frames: this.anims.generateFrameNumbers('bratutoUp', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });
  this.anims.create({
      key: 'bratutoLeft',
      frames: this.anims.generateFrameNumbers('bratutoLeft', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });
  this.anims.create({
      key: 'bratutoRight',
      frames: this.anims.generateFrameNumbers('bratutoRight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'bratutoFightDown',
      frames: this.anims.generateFrameNumbers('bratutoFightDown', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
  });
  this.anims.create({
      key: 'bratutoFightUp',
      frames: this.anims.generateFrameNumbers('bratutoFightUp', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
  });
  this.anims.create({
      key: 'bratutoFightLeft',
      frames: this.anims.generateFrameNumbers('bratutoFightLeft', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
  });
  this.anims.create({
      key: 'bratutoFightRight',
      frames: this.anims.generateFrameNumbers('bratutoFightRight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
  });

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.events.once('wake', () => {
          this.aboveLayer.setDepth(0);
          this.cameras.main.fadeIn(1000);

          setTimeout(() => {
            // By default, everything gets depth sorted on the screen in the order we created things. Here, we
            // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
            // Higher depths will sit on top of lower depth objects.
            this.aboveLayer.setDepth(10);
          }, 1000);
          this.input.keyboard.removeKey('keyup_SPACE')
        });
      
        this.triggerFightAnimation = false;
        this.isInFightAnimation = false;
        this.fightAlarm = -1;

        this.input.keyboard.on('keydown_SPACE', event => {
          this.hitEnemy();
          this.triggerFightAnimation = true;
          this.isInFightAnimation = true;
          this.fightAlarm = 10;
        });

        // this.sound.play('music', {
        //     volume: 0.2,
        //     loop: true
        // });
    }

    createPlayer() {   
      // Create a sprite with physics enabled via the physics system. The image used for the sprite has
 
      // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
      // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
      const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");
      // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
      this.player = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, "sprCharDown", 0)
        .setSize(30, 40)
        .setOffset(0, 0);
      this.player.setDepth(config.playerDepth);
      this.player.body.immovable = true;
      this.player.health = 1000;
      this.player.maxHealth = 1000;
      this.player.damage = 20;
      this.player.range = 20;
      this.player.speed = config.playerSpeed;
      this.player.direction = {x:0, y:0};
    }

    hitEnemy() {
      const player = this.player;
      const range = player.range;
      const direction = player.direction || {x: 0, y:0};
      const initialy = player.y
      const x = direction.x ? player.x + range * direction.x : player.x;
      const y = initialy ? initialy + range * direction.y : initialy;
      this.hitzone && this.hitzone.destroy();
      this.hitzone = this.physics.add.sprite(x, y, 'hitzone');
      this.hitzone.setVisible(false);
      this.hitzone.duration = 5;
      this.physics.add.collider(this.hitzone, this.enemiesGroup, (phitzone, enemy) => {
          phitzone.destroy();
          enemy.health -= player.damage;
      });
      // this.sound.play('slap');
    }

    fillRect(graphics, {x,y,percent,height, width, color, borderColor}) {
      if (graphics) {
        graphics.clear();
        graphics.fillStyle(color, 1);
        graphics.fillRect(
          x,y,
          percent * width,
          height
        );
        graphics.lineStyle(2, borderColor);
        graphics.strokeRect(x,y, width, height);
      }
    }
    

    updatePlayer() {
        if(--this.fightAlarm == 0){
          this.isInFightAnimation = false;
        }

        const speed = this.player.speed;
        const prevVelocity = this.player.body.velocity.clone();
      
        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);
      
        if (!this.isInFightAnimation)
        {
          // Horizontal movement
          if (this.cursors.left.isDown) {
              this.player.body.setVelocityX(-speed);
          } else if (this.cursors.right.isDown) {
              this.player.body.setVelocityX(speed);
          }
        
          // Vertical movement
          if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
          } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
          }
       }
      
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);
      
        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0)  {
          this.player.direction = {y: 0, x: -1};
        }
        else if (prevVelocity.x > 0) {
          this.player.direction = {y: 0, x: 1};
        }
        else if (prevVelocity.y < 0) {
          this.player.direction = {y: -1, x: 0};
        } 
        else if (prevVelocity.y > 0) {
          this.player.direction = {y: 1, x: 0};
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.triggerFightAnimation){
          if (this.player.direction.x < 0) {
            this.player.anims.play("kyciFightLeft", true, 0);
          } else if (this.player.direction.x > 0) {
            this.player.anims.play("kyciFightRight", true, 0);
          } else if (this.player.direction.y > 0) {
            this.player.anims.play("kyciFightDown", true, 0);
          } else if (this.player.direction.y < 0) {
            this.player.anims.play("kyciFightUp", true, 0);
          }
        }
        if (this.cursors.left.isDown) {
          if (!this.isInFightAnimation){
            this.player.anims.play("kyciLeft", true, 0);
          }
        } else if (this.cursors.right.isDown) {
          if (!this.isInFightAnimation){
            this.player.anims.play("kyciRight", true, 0);
          }
        } else if (this.cursors.up.isDown) {
          if (!this.isInFightAnimation){
            this.player.anims.play("kyciUp", true, 0);
          }
        } else if (this.cursors.down.isDown) {
          if (!this.isInFightAnimation){
            this.player.anims.play("kyciDown", true, 0);
          }
        } else {
            if (!this.isInFightAnimation) {
              this.player.anims.stop();
              // If we were moving, pick and idle frame to use
              if (this.player.direction.x < 0) this.player.setTexture("sprCharLeft", 0);
              else if (this.player.direction.x > 0) this.player.setTexture("sprCharRight", 0);
              else if (this.player.direction.y < 0) this.player.setTexture("sprCharUp", 0);
              else if (this.player.direction.y > 0) this.player.setTexture("sprCharDown", 0);
            }
          }
        if (this.hitzone) {
          this.hitzone.duration--;
          if (this.hitzone.duration == 0) {
            this.hitzone.destroy();
          }
        }

        this.triggerFightAnimation = false;
    }

    updateLifebar() {
      var cam = this.cameras.main;
      const offsetX = cam._scrollX;
      const offsetY = cam._scrollY;
      const percent = this.player.health / this.player.maxHealth;
      this.fillRect(this.lifeBar, {
        x: offsetX + 100,
        y: offsetY + 40,
        percent,
        width: 100,
        height: 15,
        color: 0xe66a28,
        borderColor: 0xffffff
      });
      this.fillRect(this.lifeBarBg, {x: offsetX, y: offsetY, height: 100, width: 240, percent: 1, color: 0xd8c880, borderColor:0xffffff});

    }
    powerupPlayer(powerup) {
      this.player[powerup.type] += powerup.modifier;
  }

  dropPowerups(enemy) {
      const sumX = this.player.x > enemy.x ? -20 : 20;
      const sumY = this.player.y > enemy.y ? -20 : 20;
      const powerupModifier = getPowerup();
      const fontStyle = {
          fontSize: '40px',
          color: powerupModifier.color
      }
      const powerup = this.physics.add.sprite(enemy.x + sumX * (Math.random()), enemy.y + sumY * (Math.random()) , powerupModifier.type);

      this.physics.add.overlap(powerup, this.player, (powerup) => {
          powerup.destroy();
         
          const text = this.add.text(powerup.x, powerup.y, powerupModifier.text, fontStyle).setOrigin(0.5, 0.5)
          this.tweens.add({
              targets: text,  
              scale: { from: 1, to: 0},
              y: { from: text.y, to: text.y - 50},
              ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
              duration: 800,
              repeat: 0,            // -1: infinity
              yoyo: false
          });
          this.powerupPlayer(powerupModifier);
      });
  }

  createEnemies(sprite, scale, damage, health, sizeX, sizeY) {
      for (let i = 0; i < this.enemiesCount; i ++) {
          const enemy = this.physics.add
              .sprite(Math.random() * 50, Math.random() * 150, sprite + "Left", 0)
              .setOffset(20, 20)
              .setScale(scale, scale)
              .setSize(sizeX, sizeY)
              .setDepth(config.playerDepth);
              
          enemy.body.immovable = true;
          enemy.lastHit = 0;
          enemy.damage = damage;
          enemy.spriteName = sprite;
          enemy.health = health;
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
              enemy.anims.play(enemy.spriteName + "Right", true, 0);
          } else if (this.player.x < enemy.x){
              enemy.anims.play(enemy.spriteName + "Left", true, 0);
          } else {
              enemy.anims.stop();
          }
      } else {
          if (this.player.y >= enemy.y) {
              enemy.anims.play(enemy.spriteName + "Down", true, 0);
          } else if (this.player.y < enemy.y){
              enemy.anims.play(enemy.spriteName + "Up", true, 0);
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
                  enemy.anims.play(enemy.spriteName + "FightRight", true, 0);
              } else {
                  enemy.anims.play(enemy.spriteName + "FightLeft", true, 0);
              }
          } else {
              if (yDif > 0) {
                  enemy.anims.play(enemy.spriteName + "FightUp", true, 0);
              } else {
                  enemy.anims.play(enemy.spriteName + "FightDown", true, 0);                    
              }
              
          }
          enemy.lastHit = time;
          player.health -= enemy.damage;
          // this.sound.play('grunt');
      }

      if ((time - enemy.lastHit) >= 200 && enemy.isHitting) {
          enemy.isHitting = false;
          enemy.anims.stop();
      }
  }

    update(time) {
      this.updatePlayer();
      this.updateLifebar();
      if (this.player.health <= 0) {
        this.physics.add.sprite(this.player.x, this.player.y , 'tombstone');
        this.player.destroy();
      }
      this.enemies.forEach(enemy => {
          if (enemy.health <= 0) {
              enemy.destroy();
              debugger;
              this.lastDeadEnemyTime = time;
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

      this.enemies = this.enemies.filter(e => e.health > 0);
      if (this.enemies.length == 0 && (time - this.lastDeadEnemyTime) > 2000 && this.scene.scene) {
          let action = this.scene.key.match(/\d+/)[0];
          this.scene.start('DialogScene', {action: 'pre_scene' + (parseInt(action) + 1), nextSceneKey: 'Level' + (parseInt(action) + 1) + 'Scene'});
          this.scene.destroy();
      }
    }

    resetMovementButtons() {
      this.cursors.up.reset();
      this.cursors.down.reset();
      this.cursors.left.reset();
      this.cursors.right.reset();
  }
}