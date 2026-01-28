// Enemy class
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'small', movementPattern = 0) {
        // Randomly choose enemy sprite variant
        const spriteKey = `enemy-${type}-${Phaser.Math.Between(1, 2)}`;
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.health = Config.enemy[type].health;
        this.speed = Config.enemy[type].speed;
        this.scoreValue = Config.enemy[type].score;
        this.powerUpChance = Config.enemy[type].powerUpChance;

        // Movement
        this.movementPattern = movementPattern;
        this.startX = x;
        this.startY = y;
        this.moveCounter = 0;
        this.diveStarted = false;

        // Scale based on type (made bigger)
        if (type === 'large') {
            this.setScale(3.0);
        } else if (type === 'medium') {
            this.setScale(2.5);
        } else {
            this.setScale(2.0); // Small enemies
        }

        // Shooting for medium/large enemies
        this.canShoot = (type === 'medium' || type === 'large');
        this.shootChance = Config.enemyProjectile.shootChance[type] || 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.moveCounter += delta;

        // Apply movement pattern
        switch (this.movementPattern) {
            case 0:
                // Straight down
                this.setVelocityY(this.speed);
                this.setVelocityX(0);
                break;

            case 1:
                // Sine wave
                this.setVelocityY(this.speed);
                this.x = this.startX + Math.sin(this.moveCounter / 300) * 100;
                break;

            case 2:
                // Dive attack - move down then swoop toward player
                if (!this.diveStarted && this.y > 150) {
                    this.diveStarted = true;
                    const player = this.scene.player;
                    if (player && player.active) {
                        const angle = Phaser.Math.Angle.Between(
                            this.x, this.y,
                            player.x, player.y
                        );
                        this.setVelocity(
                            Math.cos(angle) * this.speed * 1.5,
                            Math.sin(angle) * this.speed * 1.5
                        );
                    }
                } else if (!this.diveStarted) {
                    this.setVelocityY(this.speed * 0.5);
                }
                break;

            case 3:
                // Tracking - slowly follows player horizontally
                this.setVelocityY(this.speed);
                const player = this.scene.player;
                if (player && player.active && this.y < Config.height / 2) {
                    const targetX = player.x;
                    const diff = targetX - this.x;
                    this.setVelocityX(Phaser.Math.Clamp(diff * 0.5, -this.speed * 0.7, this.speed * 0.7));
                }
                break;
        }

        // Try to shoot (medium and large enemies)
        if (this.canShoot && this.y > 100 && this.y < Config.height - 100) {
            if (Math.random() < this.shootChance) {
                this.shoot();
            }
        }

        // Remove when off screen
        if (this.y > Config.height + 50 || this.x < -50 || this.x > Config.width + 50) {
            // Notify wave manager that enemy left screen (counts as killed for wave progression)
            if (this.scene.waveManager) {
                this.scene.waveManager.onEnemyKilled();
            }
            this.destroy();
        }
    }

    shoot() {
        const player = this.scene.player;
        if (!player || !player.active) return;

        // Get a projectile from the scene's enemy projectile pool
        if (this.scene.enemyProjectiles) {
            const projectile = this.scene.enemyProjectiles.get();
            if (projectile) {
                projectile.fire(this.x, this.y + 20, player.x, player.y);
                this.scene.sound.play('shoot', { volume: 0.2, rate: 0.6 });
            }
        }
    }

    takeDamage(damage) {
        this.health -= damage;

        // Flash white when hit
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });

        if (this.health <= 0) {
            this.explode();
            return true; // Enemy destroyed
        }

        return false;
    }

    explode() {
        // Create explosion animation - larger for bigger enemies
        const explosion = this.scene.add.sprite(this.x, this.y, 'explosion1');
        const scale = this.type === 'large' ? 1.5 : (this.type === 'medium' ? 1.2 : 1);
        explosion.setScale(scale);
        explosion.play('explode');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });

        this.scene.sound.play('explosion', { volume: 0.4 });

        // Add to score with combo
        if (this.scene.scoreManager) {
            this.scene.scoreManager.addKill(this.scoreValue);
        }

        // Notify wave manager
        if (this.scene.waveManager) {
            this.scene.waveManager.onEnemyKilled();
        }

        // Chance to drop power-up
        if (Math.random() < this.powerUpChance) {
            this.dropPowerUp();
        }

        this.destroy();
    }

    dropPowerUp() {
        // Weighted random power-up selection
        const rand = Math.random();
        let type;

        if (rand < 0.4) {
            type = 'weapon';
        } else if (rand < 0.7) {
            type = 'shield';
        } else if (rand < 0.9) {
            type = 'speed';
        } else {
            type = 'bomb';
        }

        const powerUp = new PowerUp(this.scene, this.x, this.y, type);
        this.scene.powerUps.add(powerUp);
    }
}
