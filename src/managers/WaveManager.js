// WaveManager - Handles progressive wave spawning
class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0;
        this.enemiesInWave = 0;
        this.enemiesKilled = 0;
        this.waveActive = false;
        this.isBossWave = false;  // Track if current wave is a boss wave
        this.waveStartDelay = 2000; // 2 seconds between waves
    }

    startNextWave() {
        this.currentWave++;
        this.enemiesKilled = 0;
        this.waveActive = true;

        console.log(`[WaveManager] Starting Wave ${this.currentWave}`);
        console.log(`[WaveManager] Boss spawn check: ${this.currentWave} % ${Config.boss.spawnWave} = ${this.currentWave % Config.boss.spawnWave}`);

        // Show wave number
        this.showWaveText();

        // Check if boss wave
        if (this.currentWave % Config.boss.spawnWave === 0) {
            console.log(`[WaveManager] *** BOSS WAVE DETECTED! Spawning boss... ***`);
            this.isBossWave = true;
            this.spawnBoss();
        } else {
            this.isBossWave = false;
            // Calculate enemy count for this wave
            const enemyCount = Config.waves.enemyCountBase +
                              (this.currentWave - 1) * Config.waves.enemyCountIncrease;

            this.enemiesInWave = enemyCount;

            // Spawn enemies based on wave number
            this.spawnWaveEnemies(enemyCount);
        }
    }

    spawnBoss() {
        console.log(`[WaveManager] spawnBoss() called - preparing boss spawn`);
        this.enemiesInWave = 1; // Boss counts as 1 enemy

        // Show boss warning
        console.log(`[WaveManager] Showing boss warning text`);
        const text = this.scene.add.text(
            Config.width / 2,
            Config.height / 2,
            'WARNING! BOSS APPROACHING!',
            {
                fontSize: '40px',
                fill: '#ff0000',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            }
        );
        text.setOrigin(0.5);
        text.setDepth(200);

        this.scene.tweens.add({
            targets: text,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                text.destroy();
                // Spawn boss after warning
                this.scene.time.delayedCall(500, () => {
                    console.log(`[WaveManager] Creating Boss instance at position (${Config.width / 2}, -100)`);
                    const boss = new Boss(this.scene, Config.width / 2, -100);
                    console.log(`[WaveManager] Boss created:`, boss);
                    this.scene.boss = boss;
                    this.scene.bosses.add(boss);
                    console.log(`[WaveManager] Boss added to scene.bosses group`);
                    this.scene.showBossHealthBar();
                    console.log(`[WaveManager] Boss health bar shown`);
                });
            }
        });

        this.scene.cameras.main.shake(2000, 0.005);
        this.scene.sound.play('explosion', { volume: 0.6, rate: 0.5 });
    }

    spawnWaveEnemies(count) {
        const spawnDelay = 600; // Time between each enemy spawn

        console.log(`[WaveManager] Spawning ${count} enemies for wave ${this.currentWave}`);
        this.enemiesInWave = count;

        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * spawnDelay, () => {
                const enemyType = this.getEnemyTypeForWave();
                const pattern = this.getMovementPattern();
                const x = Phaser.Math.Between(50, Config.width - 50);

                const enemy = new Enemy(this.scene, x, -30, enemyType, pattern);
                this.scene.enemies.add(enemy);
                console.log(`[WaveManager] Spawned enemy ${i+1}/${count}`);
            });
        }

        // Occasionally spawn asteroids
        if (this.currentWave >= 2) {
            const asteroidCount = Math.floor(count * Config.asteroid.spawnChance);
            for (let i = 0; i < asteroidCount; i++) {
                const delay = Phaser.Math.Between(0, count * spawnDelay);
                this.scene.time.delayedCall(delay, () => {
                    this.spawnAsteroid();
                });
            }
        }
    }

    getEnemyTypeForWave() {
        // Early waves: only small
        if (this.currentWave <= 2) {
            return 'small';
        }

        // Wave 3-5: small and medium
        if (this.currentWave <= 5) {
            const rand = Math.random();
            if (rand < 0.7) return 'small';
            return 'medium';
        }

        // Wave 6+: all types
        const rand = Math.random();
        if (rand < 0.5) return 'small';
        if (rand < 0.85) return 'medium';
        return 'large';
    }

    getMovementPattern() {
        // More patterns unlock as waves progress
        if (this.currentWave <= 3) {
            return Phaser.Math.Between(0, 1); // straight or sine
        }

        if (this.currentWave <= 6) {
            return Phaser.Math.Between(0, 2); // + dive
        }

        return Phaser.Math.Between(0, 3); // all patterns
    }

    spawnAsteroid() {
        const Asteroid = this.scene.asteroidClass;
        if (Asteroid) {
            const x = Phaser.Math.Between(50, Config.width - 50);
            const asteroid = new Asteroid(this.scene, x, -30);
            this.scene.asteroids.add(asteroid);
        }
    }

    onEnemyKilled() {
        // Don't count regular enemy kills during boss waves
        if (this.isBossWave) {
            console.log(`[WaveManager] Enemy killed during boss wave - ignoring (boss must be defeated instead)`);
            return;
        }

        this.enemiesKilled++;
        console.log(`[WaveManager] Enemy killed: ${this.enemiesKilled}/${this.enemiesInWave}, waveActive: ${this.waveActive}`);

        // Check if wave is complete
        if (this.waveActive && this.enemiesKilled >= this.enemiesInWave) {
            console.log(`[WaveManager] Wave ${this.currentWave} complete!`);
            this.completeWave();
        }
    }

    onBossDefeated() {
        console.log(`[WaveManager] onBossDefeated() called - wave ${this.currentWave}`);

        // Boss counts as completing the wave
        this.enemiesKilled = this.enemiesInWave;
        this.scene.hideBossHealthBar();

        console.log(`[WaveManager] Calling completeWave()`);
        this.completeWave();
    }

    completeWave() {
        console.log(`[WaveManager] completeWave() called for wave ${this.currentWave}`);
        this.waveActive = false;

        // Show wave complete message
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        const text = this.scene.add.text(width / 2, height / 2,
            'WAVE ' + this.currentWave + ' COMPLETE!', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        text.setDepth(200);
        text.setScrollFactor(0);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                console.log(`[WaveManager] Wave complete tween finished, destroying text`);
                text.destroy();
                // Start next wave
                console.log(`[WaveManager] Scheduling next wave in ${this.waveStartDelay}ms`);
                this.scene.time.delayedCall(this.waveStartDelay, () => {
                    console.log(`[WaveManager] Timer fired, starting next wave`);
                    this.startNextWave();
                });
            }
        });

        // Bonus score for completing wave
        const bonus = this.currentWave * 500;
        this.scene.scoreManager.score += bonus;

        const bonusText = this.scene.add.text(width / 2, height / 2 + 40,
            '+' + bonus + ' BONUS', {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'monospace'
        });
        bonusText.setOrigin(0.5);
        bonusText.setDepth(200);
        bonusText.setScrollFactor(0);

        this.scene.tweens.add({
            targets: bonusText,
            y: bonusText.y - 30,
            alpha: 0,
            duration: 2000,
            onComplete: () => bonusText.destroy()
        });
    }

    showWaveText() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        const text = this.scene.add.text(width / 2, height / 2,
            'WAVE ' + this.currentWave, {
            fontSize: '48px',
            fill: '#00c8ff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        text.setDepth(200);

        // Pulse in
        text.setScale(0);
        this.scene.tweens.add({
            targets: text,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Fade out
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            delay: 800,
            duration: 500,
            onComplete: () => text.destroy()
        });
    }

    getCurrentWave() {
        return this.currentWave;
    }

    getProgress() {
        return {
            wave: this.currentWave,
            killed: this.enemiesKilled,
            total: this.enemiesInWave
        };
    }
}
