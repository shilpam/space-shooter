// GameScene - Main gameplay with Milestone 2 features
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Game state
        this.gameOver = false;

        // Create managers
        this.scoreManager = new ScoreManager(this);
        this.waveManager = new WaveManager(this);

        // Create parallax background with planets
        this.createBackground();

        // Create player
        this.player = new Player(this, Config.width / 2, Config.height - 80);

        // Create groups
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.bosses = this.physics.add.group({
            classType: Boss,
            runChildUpdate: true
        });

        this.powerUps = this.physics.add.group({
            classType: PowerUp,
            runChildUpdate: true
        });

        this.asteroids = this.physics.add.group({
            classType: Asteroid,
            runChildUpdate: true
        });

        // Enemy projectiles pool
        this.enemyProjectiles = this.physics.add.group({
            classType: EnemyProjectile,
            maxSize: 50,
            runChildUpdate: true
        });

        // Store asteroid class reference for WaveManager
        this.asteroidClass = Asteroid;
        this.boss = null;

        // Set up collisions
        this.setupCollisions();

        // Create UI
        this.createUI();

        // Pause handling
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.gameOver) {
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });

        // Start first wave
        this.time.delayedCall(1000, () => {
            this.waveManager.startNextWave();
        });
    }

    createBackground() {
        // Far background (slowest)
        this.bgBack = this.add.tileSprite(
            Config.width / 2,
            Config.height / 2,
            Config.width,
            Config.height,
            'bg-back'
        );

        // Big planet
        this.planetBig = this.add.image(
            Config.width * 0.7,
            Config.height * 0.3,
            'planet-big'
        );
        this.planetBig.setScale(0.8);
        this.planetBig.setAlpha(0.6);

        // Small planet
        this.planetSmall = this.add.image(
            Config.width * 0.3,
            Config.height * 0.7,
            'planet-small'
        );
        this.planetSmall.setScale(0.6);
        this.planetSmall.setAlpha(0.5);

        // Stars layer (faster scroll)
        this.bgStars = this.add.tileSprite(
            Config.width / 2,
            Config.height / 2,
            Config.width,
            Config.height,
            'bg-stars'
        );
    }

    createUI() {
        const padding = 16;
        const lineHeight = 26;

        // Score
        this.scoreText = this.add.text(padding, padding, 'SCORE: 0', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.scoreText.setDepth(100);

        // Wave
        this.waveText = this.add.text(padding, padding + lineHeight, 'WAVE: 1', {
            fontSize: '18px',
            fill: '#00c8ff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.waveText.setDepth(100);

        // Combo
        this.comboText = this.add.text(padding, padding + lineHeight * 2, '', {
            fontSize: '18px',
            fill: '#ffff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.comboText.setDepth(100);

        // Lives (right side)
        this.livesText = this.add.text(Config.width - padding, padding, '', {
            fontSize: '18px',
            fill: '#ff5555',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.livesText.setOrigin(1, 0);
        this.livesText.setDepth(100);

        // Shield (right side)
        this.shieldText = this.add.text(Config.width - padding, padding + lineHeight, '', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.shieldText.setOrigin(1, 0);
        this.shieldText.setDepth(100);

        // Weapon level (right side)
        this.weaponText = this.add.text(Config.width - padding, padding + lineHeight * 2, '', {
            fontSize: '18px',
            fill: '#ff00ff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.weaponText.setOrigin(1, 0);
        this.weaponText.setDepth(100);

        // Speed boost indicator (center, hidden by default)
        this.speedBoostText = this.add.text(Config.width / 2, 50, 'SPEED BOOST!', {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.speedBoostText.setOrigin(0.5);
        this.speedBoostText.setDepth(100);
        this.speedBoostText.setVisible(false);

        // Boss health bar (hidden by default)
        this.bossHealthBarBg = this.add.rectangle(Config.width / 2, 30, 400, 20, 0x330000);
        this.bossHealthBarBg.setDepth(100);
        this.bossHealthBarBg.setVisible(false);

        this.bossHealthBar = this.add.rectangle(Config.width / 2, 30, 400, 20, 0xff0000);
        this.bossHealthBar.setDepth(101);
        this.bossHealthBar.setVisible(false);

        this.bossHealthText = this.add.text(Config.width / 2, 30, 'BOSS', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.bossHealthText.setOrigin(0.5);
        this.bossHealthText.setDepth(102);
        this.bossHealthText.setVisible(false);

        this.updateUI();
    }

    setupCollisions() {
        // Player projectiles vs enemies
        this.physics.add.overlap(
            this.player.getProjectiles(),
            this.enemies,
            this.projectileHitEnemy,
            null,
            this
        );

        // Player projectiles vs asteroids
        this.physics.add.overlap(
            this.player.getProjectiles(),
            this.asteroids,
            this.projectileHitAsteroid,
            null,
            this
        );

        // Player vs enemies
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.playerHitEnemy,
            null,
            this
        );

        // Player vs asteroids
        this.physics.add.overlap(
            this.player,
            this.asteroids,
            this.playerHitAsteroid,
            null,
            this
        );

        // Player vs power-ups
        this.physics.add.overlap(
            this.player,
            this.powerUps,
            this.playerCollectPowerUp,
            null,
            this
        );

        // Player projectiles vs boss
        this.physics.add.overlap(
            this.player.getProjectiles(),
            this.bosses,
            this.projectileHitBoss,
            null,
            this
        );

        // Enemy projectiles vs player
        this.physics.add.overlap(
            this.player,
            this.enemyProjectiles,
            this.enemyProjectileHitPlayer,
            null,
            this
        );

        // Boss projectiles vs player
        this.physics.add.collider(
            this.player,
            this.bosses,
            (player, boss) => {
                // Get boss projectiles
                if (boss.getProjectiles) {
                    this.physics.add.overlap(
                        player,
                        boss.getProjectiles(),
                        this.enemyProjectileHitPlayer,
                        null,
                        this
                    );
                }
            }
        );
    }

    projectileHitEnemy(projectile, enemy) {
        if (projectile.active && enemy.active) {
            projectile.setActive(false);
            projectile.setVisible(false);

            if (enemy.takeDamage(projectile.damage)) {
                // Enemy destroyed
                this.addHitEffect(enemy.x, enemy.y);
            } else {
                // Enemy hit but not destroyed
                this.addSmallHitEffect(enemy.x, enemy.y);
            }
        }
    }

    projectileHitAsteroid(projectile, asteroid) {
        if (projectile.active && asteroid.active) {
            projectile.setActive(false);
            projectile.setVisible(false);

            if (asteroid.takeDamage(projectile.damage)) {
                // Asteroid destroyed
                this.addHitEffect(asteroid.x, asteroid.y);
            } else {
                this.addSmallHitEffect(asteroid.x, asteroid.y);
            }
        }
    }

    playerHitEnemy(player, enemy) {
        if (enemy.active && !player.isInvulnerable) {
            enemy.explode();

            const playerDied = player.takeDamage();
            this.updateUI();

            if (playerDied) {
                this.handleGameOver();
            } else {
                this.cameras.main.shake(200, 0.005);
            }
        }
    }

    playerHitAsteroid(player, asteroid) {
        if (asteroid.active && !player.isInvulnerable) {
            asteroid.explode();

            const playerDied = player.takeDamage();
            this.updateUI();

            if (playerDied) {
                this.handleGameOver();
            } else {
                this.cameras.main.shake(200, 0.005);
            }
        }
    }

    playerCollectPowerUp(player, powerUp) {
        if (powerUp.active) {
            powerUp.collect(player);
            this.updateUI();

            // Show speed boost indicator
            if (powerUp.type === 'speed') {
                this.showSpeedBoost();
            }
        }
    }

    projectileHitBoss(projectile, boss) {
        if (projectile.active && boss.active) {
            projectile.setActive(false);
            projectile.setVisible(false);

            if (boss.takeDamage(projectile.damage)) {
                // Boss destroyed
                this.addHitEffect(boss.x, boss.y);
            } else {
                this.addSmallHitEffect(boss.x, boss.y);
            }
        }
    }

    enemyProjectileHitPlayer(player, projectile) {
        if (projectile.active && !player.isInvulnerable) {
            projectile.setActive(false);
            projectile.setVisible(false);

            const playerDied = player.takeDamage();
            this.updateUI();

            if (playerDied) {
                this.handleGameOver();
            } else {
                this.cameras.main.shake(150, 0.004);
            }
        }
    }

    addHitEffect(x, y) {
        // Simple hit flash (bigger)
        const flash = this.add.circle(x, y, 30, 0xffffff, 0.8);
        flash.setDepth(75);

        this.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }

    addSmallHitEffect(x, y) {
        const flash = this.add.circle(x, y, 16, 0xffff00, 0.6);
        flash.setDepth(75);

        this.tweens.add({
            targets: flash,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 150,
            onComplete: () => flash.destroy()
        });
    }

    showSpeedBoost() {
        this.speedBoostText.setVisible(true);

        this.tweens.add({
            targets: this.speedBoostText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 8,
            onComplete: () => {
                this.speedBoostText.setVisible(false);
                this.speedBoostText.setScale(1);
            }
        });
    }

    updateUI() {
        this.scoreText.setText('SCORE: ' + this.scoreManager.getScore());
        this.waveText.setText('WAVE: ' + this.waveManager.getCurrentWave());

        const multiplier = this.scoreManager.getComboMultiplier();
        if (multiplier > 1) {
            this.comboText.setText('COMBO: x' + multiplier);
            this.comboText.setFill(this.scoreManager.getComboColor());
        } else {
            this.comboText.setText('');
        }

        if (this.player && this.player.active) {
            this.livesText.setText('♥ ' + this.player.lives);

            if (this.player.shield > 0) {
                this.shieldText.setText('⬡ ' + this.player.shield);
                this.shieldText.setVisible(true);
            } else {
                this.shieldText.setVisible(false);
            }

            const weaponNames = ['', 'SINGLE', 'DOUBLE', 'TRIPLE'];
            this.weaponText.setText('⚡ ' + weaponNames[this.player.weaponLevel]);
        }
    }

    showBossHealthBar() {
        this.bossHealthBarBg.setVisible(true);
        this.bossHealthBar.setVisible(true);
        this.bossHealthText.setVisible(true);
    }

    hideBossHealthBar() {
        this.bossHealthBarBg.setVisible(false);
        this.bossHealthBar.setVisible(false);
        this.bossHealthText.setVisible(false);
    }

    updateBossHealth(current, max) {
        const percent = current / max;
        this.bossHealthBar.width = 400 * percent;
        this.bossHealthText.setText(`BOSS ${Math.ceil(current)}/${max}`);
    }

    handleGameOver() {
        this.gameOver = true;

        // Create game over explosion at player position
        const explosion = this.add.sprite(this.player.x, this.player.y, 'explosion1');
        explosion.play('explode');
        explosion.setScale(2.5);

        this.sound.play('explosion', { volume: 0.7 });
        this.cameras.main.shake(500, 0.01);

        // Transition to game over scene
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene', {
                score: this.scoreManager.getScore(),
                wave: this.waveManager.getCurrentWave()
            });
        });
    }

    update(time, delta) {
        if (this.gameOver) {
            return;
        }

        // Scroll background layers at different speeds
        this.bgBack.tilePositionY -= Config.background.scrollSpeed * delta / 1000 * 0.2;
        this.bgStars.tilePositionY -= Config.background.scrollSpeed * delta / 1000;

        // Parallax planets
        this.planetBig.y -= Config.background.scrollSpeed * delta / 1000 * 0.15;
        this.planetSmall.y -= Config.background.scrollSpeed * delta / 1000 * 0.25;

        // Wrap planets
        if (this.planetBig.y < -100) {
            this.planetBig.y = Config.height + 100;
            this.planetBig.x = Phaser.Math.Between(100, Config.width - 100);
        }
        if (this.planetSmall.y < -100) {
            this.planetSmall.y = Config.height + 100;
            this.planetSmall.x = Phaser.Math.Between(100, Config.width - 100);
        }

        // Update player
        if (this.player && this.player.active) {
            this.player.update(time);
        }

        // Update UI periodically
        if (time % 100 < delta) {
            this.updateUI();
        }
    }
}
