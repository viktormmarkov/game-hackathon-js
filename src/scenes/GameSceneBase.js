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
        .sprite(spawnPoint.x, spawnPoint.y, "sprCharDown", "kyciDown")
        .setSize(30, 40)
        .setOffset(0, 24);
      this.player.setDepth(config.playerDepth);
      this.player.body.immovable = true;
    }
      
    create() {
      
        this.worldLayer.setCollisionByProperty({ collides: true });
      
        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        this.aboveLayer.setDepth(10);

    
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
      
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      
        this.cursors = this.input.keyboard.createCursorKeys();
      
        this.input.keyboard.on('keydown_SPACE', event => {
            console.log('shoot');
        });
    }
    

    updatePlayer() {
        const speed = config.playerSpeed;
        const prevVelocity = this.player.body.velocity.clone();
      
        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);
      
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
      
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);
      
        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
          this.player.anims.play("kyciLeft", true);
        } else if (this.cursors.right.isDown) {
          this.player.anims.play("kyciRight", true);
        } else if (this.cursors.up.isDown) {
          this.player.anims.play("kyciUp", true);
        } else if (this.cursors.down.isDown) {
          this.player.anims.play("kyciDown", true);
        } else {
          this.player.anims.stop();
          // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) this.player.setTexture("sprCharLeft", "kyciLeft");
        else if (prevVelocity.x > 0) this.player.setTexture("sprCharRight", "kyciRight");
        else if (prevVelocity.y < 0) this.player.setTexture("sprCharUp", "kyciUp");
        else if (prevVelocity.y > 0) this.player.setTexture("sprCharDown", "kyciDown");
        }
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