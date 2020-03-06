import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene'})
    }
    create() {
        var polygon = new Phaser.Geom.Polygon([
            400, 100,
            200, 278,
            340, 430,
            650, 80
        ]);
        this.add.text(0,0, 'Main');
        this.player = this.add.polygon(0, 0, [0, 0, 100, 0, 100, 100, 0, 100], 0xff0000, 1);
        this.player.setOrigin(0, 0);
        // this.player.setColliderWorldBounds(true);
        // this.player.body.onWorldBounds = true;

        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (this.upKey.isDown) {
            this.player.y -=1;
        }
        else if (this.downKey.isDown)
        {
            this.player.y +=1;
        }
        if (this.leftKey.isDown)
        {
            this.player.x -=1;
        }
        else if (this.rightKey.isDown)
        {
            this.player.x +=1;
        }
    }
}