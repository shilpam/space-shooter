// BootScene - Loads all game assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Loading text
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00c8ff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load sprites
        this.load.image('player-ship', 'assets/sprites/player-ship.png');

        // Load enemy sprites
        this.load.image('enemy-small-1', 'assets/sprites/enemy-small-1.png');
        this.load.image('enemy-small-2', 'assets/sprites/enemy-small-2.png');
        this.load.image('enemy-medium-1', 'assets/sprites/enemy-medium1.png');
        this.load.image('enemy-medium-2', 'assets/sprites/enemy-medium2.png');
        this.load.image('enemy-large-1', 'assets/sprites/enemy-big1.png');
        this.load.image('enemy-large-2', 'assets/sprites/enemy-big2.png');

        // Load projectiles
        this.load.image('laser-bolt', 'assets/sprites/laser-bolt.png');
        this.load.image('laser-bolt-2', 'assets/sprites/laser-bolts2.png');
        this.load.image('laser-bolt-3', 'assets/sprites/laser-bolts3.png');

        // Load power-ups
        this.load.image('power-up1', 'assets/sprites/power-up1.png');
        this.load.image('power-up2', 'assets/sprites/power-up2.png');
        this.load.image('power-up3', 'assets/sprites/power-up3.png');
        this.load.image('power-up4', 'assets/sprites/power-up4.png');

        // Load asteroids
        for (let i = 1; i <= 5; i++) {
            this.load.image(`asteroid-0${i}`, `assets/sprites/asteroid-0${i}.png`);
        }

        // Load explosion frames
        for (let i = 1; i <= 5; i++) {
            this.load.image(`explosion${i}`, `assets/effects/explosion${i}.png`);
        }

        // Load boss sprites (5 phases)
        for (let i = 1; i <= 5; i++) {
            this.load.image(`boss-${i}`, `assets/sprites/boss-${i}.png`);
        }

        // Load backgrounds
        this.load.image('bg-back', 'assets/backgrounds/bg-back.png');
        this.load.image('bg-stars', 'assets/backgrounds/bg-stars.png');
        this.load.image('planet-big', 'assets/backgrounds/prop-planet-big.png');
        this.load.image('planet-small', 'assets/backgrounds/prop-planet-small.png');

        // Load sounds
        this.load.audio('shoot', 'assets/sounds/shot 1.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
        this.load.audio('hit', 'assets/sounds/hit.wav');
    }

    create() {
        // Create explosion animation
        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
                { key: 'explosion5' }
            ],
            frameRate: 20,
            repeat: 0
        });

        // Start at menu
        this.scene.start('MenuScene');
    }
}
