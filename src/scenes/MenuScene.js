// MenuScene - Main menu
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.bgBack = this.add.tileSprite(width / 2, height / 2, width, height, 'bg-back');
        this.bgStars = this.add.tileSprite(width / 2, height / 2, width, height, 'bg-stars');

        // Title
        const title = this.add.text(width / 2, height / 3, 'RETRO SPACE\nSHOOTER', {
            fontSize: '64px',
            fill: '#00c8ff',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            align: 'center'
        });
        title.setOrigin(0.5);

        // Pulse animation
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Instructions
        const instructions = [
            'CONTROLS',
            '',
            'MOVE: WASD or Arrow Keys',
            'SHOOT: Space or Mouse',
            'PAUSE: ESC',
            '',
            'FEATURES',
            '',
            '- 3 Weapon Tiers',
            '- Combo System (up to x16!)',
            '- Boss Battles Every 5 Waves',
            '- Power-Ups & Asteroids'
        ];

        const instructionText = this.add.text(
            width / 2,
            height / 2 + 40,
            instructions.join('\n'),
            {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'monospace',
                align: 'center',
                lineSpacing: 4
            }
        );
        instructionText.setOrigin(0.5);

        // Start button
        const startText = this.add.text(width / 2, height - 100, 'PRESS SPACE or CLICK TO START', {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        startText.setOrigin(0.5);

        // Blink animation
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // High score
        const highScore = this.getHighScore();
        if (highScore > 0) {
            const highScoreText = this.add.text(width / 2, height - 50, `High Score: ${highScore}`, {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'monospace'
            });
            highScoreText.setOrigin(0.5);
        }

        // Input handlers
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });

        this.input.once('pointerdown', () => {
            this.startGame();
        });
    }

    update() {
        // Scroll background
        this.bgBack.tilePositionY -= 0.2;
        this.bgStars.tilePositionY -= 0.5;
    }

    startGame() {
        this.scene.start('GameScene');
    }

    getHighScore() {
        const saved = localStorage.getItem('spaceShooterHighScore');
        return saved ? parseInt(saved) : 0;
    }
}
