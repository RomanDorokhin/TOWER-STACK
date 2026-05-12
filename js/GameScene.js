class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.cameras.main.setBackgroundColor(C.bg);
    
    // Grid background
    this.grid = this.add.grid(400, 200, 1600, 800, 64, 64, 0x000000, 0, C.grid, 0.2);
    
    // Floor
    this.floor = this.add.rectangle(400, 380, 800, 40, 0x001133);
    this.physics.add.existing(this.floor, true);

    // Player
    this.player = this.physics.add.sprite(100, 300, 'sphere');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.floor);

    // Obstacles
    this.spikes = this.physics.add.group();
    this.physics.add.collider(this.spikes, this.floor);
    this.physics.add.overlap(this.player, this.spikes, this._gameOver, null, this);

    // Input
    this.input.on('pointerdown', this._jump, this);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Spawn timer
    this.time.addEvent({
      delay: SPAWN_RATE,
      callback: this._spawnSpike,
      callbackScope: this,
      loop: true
    });

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '24px', color: '#fff' });
  }

  update(time, delta) {
    if (this.gameOver) return;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this._jump();
    }

    // Move grid
    this.grid.x -= (GAME_SPEED * delta) / 1000;
    if (this.grid.x <= 0) this.grid.x = 400;

    // Move spikes
    this.spikes.getChildren().forEach(spike => {
      spike.x -= (GAME_SPEED * delta) / 1000;
      if (spike.x < -50) {
        spike.destroy();
        this.score += 10;
        this.scoreText.setText('SCORE: ' + this.score);
      }
    });
  }

  _jump() {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(PLAYER_JUMP_FORCE);
    }
  }

  _spawnSpike() {
    if (this.gameOver) return;
    const spike = this.spikes.create(900, 350, 'spike');
    spike.setOrigin(0.5, 1);
  }

  _gameOver() {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(400, 200, 'CRASHED', { fontSize: '64px', color: '#f00' }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }
}
