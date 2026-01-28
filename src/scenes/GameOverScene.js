// GameOverScene - Game over screen with restart
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 1;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.tileSprite(width / 2, height / 2, width, height, 'bg-back');

        // Game Over text
        const gameOverText = this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        gameOverText.setOrigin(0.5);

        // Score text
        const scoreText = this.add.text(width / 2, height / 2 - 20, 'Final Score: ' + this.finalScore, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        scoreText.setOrigin(0.5);

        // Wave text
        const waveText = this.add.text(width / 2, height / 2 + 15, 'Wave Reached: ' + this.finalWave, {
            fontSize: '24px',
            fill: '#00c8ff',
            fontFamily: 'monospace'
        });
        waveText.setOrigin(0.5);

        // High score
        const highScore = this.getHighScore();
        if (this.finalScore > highScore) {
            this.saveHighScore(this.finalScore);

            const newHighScoreText = this.add.text(width / 2, height / 2 + 60, 'NEW HIGH SCORE!', {
                fontSize: '24px',
                fill: '#00ff00',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            });
            newHighScoreText.setOrigin(0.5);

            // Pulse animation
            this.tweens.add({
                targets: newHighScoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else {
            const highScoreText = this.add.text(width / 2, height / 2 + 60, 'High Score: ' + highScore, {
                fontSize: '20px',
                fill: '#ffff00',
                fontFamily: 'monospace'
            });
            highScoreText.setOrigin(0.5);
        }

        // Restart instructions
        const restartText = this.add.text(width / 2, height / 2 + 130, 'Press SPACE or Click to Restart', {
            fontSize: '20px',
            fill: '#00c8ff',
            fontFamily: 'monospace'
        });
        restartText.setOrigin(0.5);

        // Blink animation
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input handlers
        this.input.keyboard.once('keydown-SPACE', () => {
            this.restartGame();
        });

        this.input.once('pointerdown', () => {
            this.restartGame();
        });
    }

    restartGame() {
        this.scene.start('GameScene');
    }

    getHighScore() {
        const saved = localStorage.getItem('spaceShooterHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore(score) {
        localStorage.setItem('spaceShooterHighScore', score.toString());
    }
}
