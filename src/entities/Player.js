// Player class
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player-ship');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Scale up player ship
        this.setScale(2.5);

        // Set up physics
        this.setCollideWorldBounds(true);
        this.setDrag(Config.player.drag);
        this.setMaxVelocity(Config.player.speed);

        // Player stats
        this.lives = Config.player.maxLives;
        this.shield = 0;
        this.maxShield = Config.player.maxShield;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 2000; // 2 seconds of invulnerability after hit

        // Weapons
        this.weaponLevel = 1;
        this.lastShotTime = 0;
        this.projectiles = scene.physics.add.group({
            classType: Projectile,
            maxSize: 50,
            runChildUpdate: true
        });

        // Power-ups
        this.hasSpeedBoost = false;
        this.speedBoostTimer = null;

        // Input keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Mouse shooting
        scene.input.on('pointerdown', () => {
            this.shoot();
        });
    }

    update(time) {
        // Movement - 8 directional
        let velocityX = 0;
        let velocityY = 0;

        // Check arrow keys or WASD
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -1;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = 1;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -1;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = 1;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        // Apply acceleration
        this.setAccelerationX(velocityX * Config.player.acceleration);
        this.setAccelerationY(velocityY * Config.player.acceleration);

        // Shooting with spacebar
        if (this.spaceKey.isDown) {
            this.shoot();
        }

        // Handle invulnerability flashing
        if (this.isInvulnerable) {
            this.alpha = Math.sin(time / 100) * 0.5 + 0.5;
        } else {
            this.alpha = 1;
        }
    }

    shoot() {
        const time = this.scene.time.now;
        const weaponConfig = Config.weapons['level' + this.weaponLevel];
        const shootDelay = weaponConfig.shootDelay;

        if (time > this.lastShotTime + shootDelay) {
            const bulletCount = weaponConfig.bullets;
            const spread = weaponConfig.spread;

            // Fire bullets based on weapon level
            if (bulletCount === 1) {
                // Single shot
                const projectile = this.projectiles.get();
                if (projectile) {
                    projectile.fire(this.x, this.y - 20);
                }
            } else if (bulletCount === 2) {
                // Double shot
                const projectile1 = this.projectiles.get();
                const projectile2 = this.projectiles.get();
                if (projectile1 && projectile2) {
                    projectile1.fire(this.x - spread, this.y - 20);
                    projectile2.fire(this.x + spread, this.y - 20);
                }
            } else if (bulletCount === 3) {
                // Triple shot
                const projectile1 = this.projectiles.get();
                const projectile2 = this.projectiles.get();
                const projectile3 = this.projectiles.get();
                if (projectile1 && projectile2 && projectile3) {
                    projectile1.fire(this.x, this.y - 20);
                    projectile2.fire(this.x - spread, this.y - 15);
                    projectile3.fire(this.x + spread, this.y - 15);
                }
            }

            this.scene.sound.play('shoot', { volume: 0.3, rate: 1 + (this.weaponLevel * 0.1) });
            this.lastShotTime = time;
        }
    }

    takeDamage() {
        if (this.isInvulnerable) {
            return false;
        }

        // Check shield first
        if (this.shield > 0) {
            this.shield--;
            this.scene.sound.play('hit', { volume: 0.4, rate: 1.5 });
            this.flashShield();
            return false;
        }

        // Break combo
        if (this.scene.scoreManager) {
            this.scene.scoreManager.breakCombo();
        }

        this.lives--;
        this.scene.sound.play('hit', { volume: 0.5 });

        if (this.lives <= 0) {
            this.destroy();
            return true; // Player died
        }

        // Make invulnerable temporarily
        this.isInvulnerable = true;
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.isInvulnerable = false;
        });

        return false;
    }

    upgradeWeapon() {
        if (this.weaponLevel < 3) {
            this.weaponLevel++;
        }
    }

    addShield() {
        if (this.shield < this.maxShield) {
            this.shield++;
        }
    }

    flashShield() {
        // Visual feedback for shield hit
        const shield = this.scene.add.circle(this.x, this.y, 30, 0x00ffff, 0.5);
        shield.setDepth(50);
        this.scene.tweens.add({
            targets: shield,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => shield.destroy()
        });
    }

    applySpeedBoost(duration) {
        this.hasSpeedBoost = true;
        const boostedSpeed = Config.player.speed * 1.5;
        this.setMaxVelocity(boostedSpeed);

        // Clear existing timer
        if (this.speedBoostTimer) {
            this.speedBoostTimer.remove();
        }

        // Set new timer
        this.speedBoostTimer = this.scene.time.delayedCall(duration, () => {
            this.hasSpeedBoost = false;
            this.setMaxVelocity(Config.player.speed);
        });
    }

    activateBomb() {
        // Destroy all enemies and asteroids on screen
        if (this.scene.enemies) {
            this.scene.enemies.children.entries.forEach(enemy => {
                if (enemy.active) {
                    enemy.explode();
                }
            });
        }

        if (this.scene.asteroids) {
            this.scene.asteroids.children.entries.forEach(asteroid => {
                if (asteroid.active) {
                    asteroid.explode();
                }
            });
        }

        // Screen flash effect
        const flash = this.scene.add.rectangle(
            Config.width / 2,
            Config.height / 2,
            Config.width,
            Config.height,
            0xffffff,
            0.8
        );
        flash.setDepth(300);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });

        // Camera shake
        this.scene.cameras.main.shake(300, 0.01);

        this.scene.sound.play('explosion', { volume: 0.8 });
    }

    getProjectiles() {
        return this.projectiles;
    }
}
