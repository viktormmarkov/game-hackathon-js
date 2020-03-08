export var DialogModalPlugin = function (scene) {
  // the scene that owns the plugin
  this.master = scene;
  this.scene = scene.scene;
  this.systems = scene.sys;
 
  if (!scene.sys.settings.isBooted) {
    scene.sys.events.once('boot', this.boot, this);
  }

  this.scene.setVisible(true);
};
 
// Register this plugin with the PluginManager
DialogModalPlugin.register = function (PluginManager) {
  PluginManager.register('DialogModalPlugin', DialogModalPlugin, 'dialogModal');
};
 
DialogModalPlugin.prototype = {
  // called when the plugin is loaded by the PluginManager
  boot: function () {
    var eventEmitter = this.systems.events;
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  },
 
  //  Called when a Scene shuts down, it may then come back again later
  // (which will invoke the 'start' event) but should be considered dormant.
  shutdown: function () {},
 
  // called when a Scene is destroyed by the Scene Manager
  destroy: function () {
    this.shutdown();
    this.scene = undefined;
    if (this.timedEvent) this.timedEvent.remove();
    if (this.text) this.text.destroy();
  },
  // Initialize the dialog modal
  init: function (opts) {
    // Check to see if any optional parameters were passed
    if (!opts) opts = {};
    // set properties from opts object or use defaults
    this.borderThickness = opts.borderThickness || 3;
    this.borderColor = opts.borderColor || 0x907748;
    this.borderAlpha = opts.borderAlpha || 1;
    this.windowAlpha = opts.windowAlpha || 0.8;
    this.windowColor = opts.windowColor || 0x303030;
    this.windowHeight = opts.windowHeight || 150;
    this.padding = opts.padding || 32;
    this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
    this.dialogSpeed = opts.dialogSpeed || 3;
    this.gameObject = opts.gameObject;
  
    // used for animating the text
    this.eventCounter = 0;
    // if the dialog window is shown
    this.visible = true;
    // the current text in the window
    this.text;
    // the text that will be displayed in the window
    this.dialog;
    this.graphics;
    this.closeBtn;
  
    // Create the dialog window
    this._createWindow();
  },

  // Gets the width of the game (based on the scene)
  _getGameWidth: function () {
    return this.systems.game.config.width;
  },
  
  // Gets the height of the game (based on the scene)
  _getGameHeight: function () {
    return this.systems.game.config.height;
  },
  
  // Calculates where to place the dialog window based on the game size
  _calculateWindowDimensions: function (width, height) {
    var x = this.padding;
    var y = height - this.windowHeight - this.padding;
    var rectWidth = width - (this.padding * 2);
    var rectHeight = this.windowHeight;
    return {
      x,
      y,
      rectWidth,
      rectHeight
    };
  },
  // Creates the inner dialog window (where the text is displayed)
  _createInnerWindow: function (x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  },
  
  // Creates the border rectangle of the dialog window
  _createOuterWindow: function (x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  },

  // Creates the dialog window
  _createWindow: function () {
    var gameHeight = this._getGameHeight();
    var gameWidth = this._getGameWidth();
    var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.master.add.graphics();

    this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
  },
  // Creates the close dialog window button
  _createCloseModalButton: function () {
    var self = this;
    this.closeBtn = this.master.make.text({
      x: this._getGameWidth() - this.padding - 14,
      y: this._getGameHeight() - this.windowHeight - this.padding + 3,
      text: 'X',
      style: {
        font: 'bold 12px Arial',
        fill: this.closeBtnColor
      }
    });
    this.closeBtn.setInteractive();
  
    this.closeBtn.on('pointerover', function () {
      this.setTint(0xff0000);
    });
    this.closeBtn.on('pointerout', function () {
      this.clearTint();
    });
    this.closeBtn.on('pointerdown', function () {
      self.toggleWindow();
      if (this.timedEvent) this.timedEvent.remove();
      if (this.text) this.text.destroy();
    });
  },
  _createCloseModalButtonBorder: function () {
    var x = this._getGameWidth() - this.padding - 20;
    var y = this._getGameHeight() - this.windowHeight - this.padding;
    this.graphics.strokeRect(x, y, 20, 20);
  },
  toggleWindow: function () {
    this.visible = !this.visible;
    if (this.text) this.text.visible = this.visible;
    if (this.graphics) this.graphics.visible = this.visible;
    if (this.closeBtn) this.closeBtn.visible = this.visible;
  },

  setDialog: function (dialog) {
    this.dialogArray = dialog;
    this.dialogIndex = 0;
    this.setText(this.dialogArray[this.dialogIndex].text, true);
  },
  setNextScene: function(nextScene) {
    this.nextScene = nextScene;
  },
  showNextText() {
    if (this.dialogIndex + 1 <= this.dialogArray.length - 1) {
      this.setText(this.dialogArray[++this.dialogIndex].text, true);
    } else {
        this.setText("finished", true);
        if (this.scene.isSleeping(this.nextScene)) {
          this.scene.wake(this.nextScene);
        } else {
          this.scene.start(this.nextScene);
        }
        this.scene.setVisible(false, 'DialogScene');
    }
  },

  getDialogIndex() {
    return this.dialogIndex;
  },

  // Sets the text for the dialog window
  setText: function (text, animate) {
    // Reset the dialog
    this.eventCounter = 0;
    this.dialog = text.split('');
    if (this.timedEvent) this.timedEvent.remove();
  
    var tempText = animate ? '' : text;
    this._setText(tempText);
  
    if (animate) {
      this.timedEvent = this.master.time.addEvent({
        delay: 150 - (this.dialogSpeed * 30),
        callback: this._animateText,
        callbackScope: this,
        loop: true
      });
    }
  },

  // Slowly displays the text in the window to make it appear annimated
  _animateText: function () {
    this.eventCounter++;
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove();
    }
  },
  
  // Calcuate the position of the text in the dialog window
  _setText: function (text) {
    // Reset the dialog
    if (this.text) this.text.destroy();
  
    var x = this.padding + 10;
    var y = this._getGameHeight() - this.windowHeight - this.padding + 10;
  
    this.text = this.master.make.text({
      x,
      y,
      text,
      style: {
        wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 }
      }
    });
  }
};