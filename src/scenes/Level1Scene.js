import Phaser from 'phaser';
import {GameSceneBase} from './GameSceneBase';
import backgroundImage from '../assets/images/dialog_scene_1.jpg'
import dialogJson from '../assets/dialogs/scene1.json'

export class Level1Scene extends GameSceneBase {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.projectionAngle = Math.PI / 6;
        this.load.image('backgroundImage', backgroundImage);
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });

        this.createPlayer();
      
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = this.map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
      
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.belowLayer = this.map.createStaticLayer("Below Player", tileset, 0, 0);
        this.worldLayer = this.map.createStaticLayer("World", tileset, 0, 0);
        this.aboveLayer = this.map.createStaticLayer("Above Player", tileset, 0, 0);
        super.create();
        
        const indexes = this.worldLayer.getTilesWithin().filter(tile => tile.properties.collides).map(tile => tile.index);
        this.worldLayer.setTileIndexCallback(indexes, (player, tile) => {
            if (tile.properties.action) {
                this.scene.sleep(this.key);
                this.resetMovementButtons();
                this.scene.launch('DialogScene', {image: 'backgroundImage', dialog: dialogJson, nextSceneKey: 'Level1Scene'})
            }
            delete tile.properties.action;
        });   
    }
}