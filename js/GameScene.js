class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.cameras.main.setBackgroundColor(C.bg);
    this.speed = GAME_SPEED_START;
    this.spawnRate = SPAWN_RATE_START;
    this.gameOver = false;
    
    // Grid background
    this.grid = this.add.grid(400, 200, 1600, 800, 64, 64, 0x000000, 0, C.grid, 0.2);
    
    // Floor
    this.floor = this.add.rectangle(400, 380, 800, 40, 0x001133);
    this.physics.add.existing(this.floor, true);

    // Player with trail
    this.player = this.physics.add.sprite(150, 300, 'sphere');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.floor);

    this.particles = this.add.particles(0, 0, 'part', {
      speed: 100,
      scale: { start: 1, end: 0 },
      alpha: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      follow: this.player
    });

    // Obstacles
    this.obstacles = this.physics.add.group();
    this.physics.add.overlap(this.player, this.obstacles, this._onHit, null, this);

    // Input
    this.input.on('pointerdown', this._jump, this);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Dynamic Spawn
    this._scheduleNextSpawn();

    this.score = 0;
    this.scoreText = this.add.text(30, 30, 'SCORE: 0', { 
      fontFamily: 'Courier New', fontSize: '32px', fontStyle: 'bold', color: '#0ff' 
    });
  }

  update(time, delta) {
    if (this.gameOver) return;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this._jump();
    }

    // Complexity progression
    this.speed += 0.05;

    // Move grid
    this.grid.x -= (this.speed * delta) / 1000;
    if (this.grid.x <= 0) this.grid.x = 400;

    // Move obstacles
    this.obstacles.getChildren().forEach(obj => {
      obj.x -= (this.speed * delta) / 1000;
      if (obj.x < -100) {
        obj.destroy();
        this.score += 10;
        this.scoreText.setText('SCORE: ' + this.score);
      }
    });
  }

  _jump() {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(PLAYER_JUMP_FORCE);
      this.cameras.main.shake(100, 0.002);
    }
  }

  _scheduleNextSpawn() {
    if (this.gameOver) return;
    this.time.delayedCall(this.spawnRate, () => {
      this._spawnObstacle();
      this.spawnRate = Math.max(600, this.spawnRate - 5); // Speed up spawning
      this._scheduleNextSpawn();
    });
  }

  _spawnObstacle() {
    const isWall = Math.random() > 0.7;
    const type = isWall ? 'wall' : 'spike';
    const y = isWall ? 340 : 364;
    
    const obj = this.obstacles.create(900, y, type);
    obj.setOrigin(0.5, 1);
    obj.body.setAllowGravity(false);
    obj.body.setImmovable(true);
  }

  _onHit() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    this.particles.stop();
    this.player.setTint(0xff0000);
    this.cameras.main.shake(500, 0.04);
    this.cameras.main.flash(200, 255, 0, 0);

    const t = this.add.text(400, 200, 'SYSTEM CRASH', { 
      fontFamily: 'Courier New', fontSize: '64px', fontStyle: 'bold', color: '#f00' 
    }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }
}
