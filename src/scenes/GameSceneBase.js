import Phaser from 'phaser';
import { config } from '../index';

export class GameSceneBase extends Phaser.Scene {
    constructor(key) {
      super({key})
    }
   
    preload() {
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
      this.player.damage = 10;
      this.player.direction = {x:0, y:0};
    }
      
    create() {
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
      this.player.health = 100;
      this.player.damage = 20;
      this.player.range = 20;
      this.player.direction = {x:0, y:0};
    }

    hitEnemy() {
      const player = this.player;
      const range = player.range;
      const direction = player.direction || {x: 0, y:0};
      const initialy = player.y // uglyhack;
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
  }
    

    updatePlayer() {
        if(--this.fightAlarm == 0){
          this.isInFightAnimation = false;
        }

        const speed = config.playerSpeed;
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

    update() {
        this.updatePlayer();
    }

    resetMovementButtons() {
      this.cursors.up.reset();
      this.cursors.down.reset();
      this.cursors.left.reset();
      this.cursors.right.reset();
  }
}