// ScoreManager - Handles scoring and combo system
class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.comboCount = 0;
        this.comboMultiplier = 1;
        this.lastKillTime = 0;
        this.comboTimer = null;
    }

    addKill(baseScore) {
        const currentTime = this.scene.time.now;

        // Check if combo is still active
        if (currentTime - this.lastKillTime < Config.combo.timeout) {
            this.comboCount++;
        } else {
            // Combo timed out, reset
            this.comboCount = 1;
        }

        this.lastKillTime = currentTime;

        // Calculate combo multiplier based on kills
        this.updateComboMultiplier();

        // Add score with multiplier
        const scoreGained = baseScore * this.comboMultiplier;
        this.score += scoreGained;

        // Show floating score text
        this.showScoreText(scoreGained);

        // Reset combo timer
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        this.comboTimer = this.scene.time.delayedCall(Config.combo.timeout, () => {
            this.resetCombo();
        });

        return scoreGained;
    }

    updateComboMultiplier() {
        // Find the appropriate multiplier based on kill count
        for (let i = Config.combo.multipliers.length - 1; i >= 0; i--) {
            if (this.comboCount >= Config.combo.killsForNextLevel[i]) {
                this.comboMultiplier = Config.combo.multipliers[i];
                break;
            }
        }
    }

    resetCombo() {
        this.comboCount = 0;
        this.comboMultiplier = 1;
    }

    breakCombo() {
        // Called when player takes damage
        if (this.comboCount > 3) {
            // Show "COMBO BROKEN!" text
            const width = this.scene.cameras.main.width;
            const height = this.scene.cameras.main.height;

            const text = this.scene.add.text(width / 2, height / 2, 'COMBO BROKEN!', {
                fontSize: '32px',
                fill: '#ff0000',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            });
            text.setOrigin(0.5);
            text.setDepth(200);

            this.scene.tweens.add({
                targets: text,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0,
                duration: 1000,
                onComplete: () => text.destroy()
            });
        }

        this.resetCombo();

        if (this.comboTimer) {
            this.comboTimer.remove();
            this.comboTimer = null;
        }
    }

    showScoreText(score) {
        // Find a random enemy position or use center
        const x = Phaser.Math.Between(200, Config.width - 200);
        const y = Phaser.Math.Between(100, 200);

        const color = this.getComboColor();
        const text = this.scene.add.text(x, y, '+' + score, {
            fontSize: '20px',
            fill: color,
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        text.setDepth(150);

        this.scene.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    getComboColor() {
        if (this.comboMultiplier >= 16) return '#ff00ff'; // x16 Purple
        if (this.comboMultiplier >= 8) return '#ff0000';  // x8 Red
        if (this.comboMultiplier >= 4) return '#ff8800';  // x4 Orange
        if (this.comboMultiplier >= 2) return '#ffff00';  // x2 Yellow
        return '#ffffff'; // x1 White
    }

    getScore() {
        return this.score;
    }

    getComboMultiplier() {
        return this.comboMultiplier;
    }

    getComboCount() {
        return this.comboCount;
    }
}
