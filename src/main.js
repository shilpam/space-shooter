// Main game configuration
const config = {
    type: Phaser.AUTO,
    width: Config.width,
    height: Config.height,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Config.width,
        height: Config.height
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Config.physics.gravity },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, PauseScene, GameOverScene]
};

// Create game instance
const game = new Phaser.Game(config);
