import Phaser from 'phaser';

export class GameSceneBase extends Phaser.Scene {
    constructor(key) {
        super({key})
    }
   
      
    create() {
        const map = this.make.tilemap({ key: "map" });
      
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
      
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
      
        worldLayer.setCollisionByProperty({ collides: true });
      
        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(10);
      
        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
      
        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
        this.player = this.physics.add
          .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
          .setSize(30, 40)
          .setOffset(0, 24);
      
        // Watch the player and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.player, worldLayer);
      
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
      
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      
        this.cursors = this.input.keyboard.createCursorKeys();
      
        this.input.keyboard.on('keydown_SPACE', event => {
            console.log('shoot');
        });

        this.enemy = this.physics.add
            .sprite(spawnPoint.x + 40, spawnPoint.y - 40, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);

        this.physics.add.collider(this.enemy, worldLayer);
        // this.physics.add.collider(this.enemy, this.player);
        this.physics.add.overlap(this.enemy, this.player, () => {
            console.log('aaa')
        })
    }
    

    updatePlayer() {
        const speed = 175;
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
          this.player.anims.play("misa-left-walk", true);
        } else if (this.cursors.right.isDown) {
          this.player.anims.play("misa-right-walk", true);
        } else if (this.cursors.up.isDown) {
          this.player.anims.play("misa-back-walk", true);
        } else if (this.cursors.down.isDown) {
          this.player.anims.play("misa-front-walk", true);
        } else {
          this.player.anims.stop();
          // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
        else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
        else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
        else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
        }
    }

    updateEnemies() {
        const speed = 20;
        const playerPosition = this.player.getTopCenter()
        // console.log(playerPosition);
        const enemyPosition = this.enemy.getTopCenter();
        // console.log(enemyPosition);
        // debugger;
        // this.enemy.body.setVelocity(enemyPosition.x + 1, enemyPosition.y - 1);
        
    }
      
    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
}