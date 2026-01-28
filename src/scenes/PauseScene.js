// PauseScene - Pause menu overlay
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Semi-transparent overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
        overlay.setDepth(0);

        // Paused text
        const pausedText = this.add.text(width / 2, height / 3, 'PAUSED', {
            fontSize: '64px',
            fill: '#00c8ff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        pausedText.setOrigin(0.5);
        pausedText.setDepth(1);

        // Menu options
        const menuText = this.add.text(width / 2, height / 2,
            'ESC or SPACE - Resume\n\nQ - Quit to Menu', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace',
            align: 'center',
            lineSpacing: 10
        });
        menuText.setOrigin(0.5);
        menuText.setDepth(1);

        // Input handlers
        this.input.keyboard.once('keydown-ESC', () => {
            this.resumeGame();
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.resumeGame();
        });

        this.input.keyboard.once('keydown-Q', () => {
            this.quitToMenu();
        });

        // Click to resume
        this.input.once('pointerdown', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    quitToMenu() {
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
