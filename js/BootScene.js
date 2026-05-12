class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Player Sphere
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 14);
    g.lineStyle(2, C.player, 1);
    g.strokeCircle(16, 16, 14);
    g.generateTexture('sphere', 32, 32);

    // Spike
    g.clear();
    g.fillStyle(C.spike, 1);
    g.beginPath();
    g.moveTo(16, 0);
    g.lineTo(32, 32);
    g.lineTo(0, 32);
    g.closePath();
    g.fillPath();
    g.generateTexture('spike', 32, 32);

    // Wall (Tall Obstacle)
    g.clear();
    g.fillStyle(C.wall, 1);
    g.fillRect(0, 0, 32, 80);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokeRect(2, 2, 28, 76);
    g.generateTexture('wall', 32, 80);

    // Particle
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture('part', 4, 4);

    this.scene.start('GameScene');
  }
}
