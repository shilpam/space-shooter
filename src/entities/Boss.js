// Boss class - Multi-phase boss enemy
class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss-1');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.maxHealth = Config.boss.health;
        this.health = this.maxHealth;
        this.speed = Config.boss.speed;
        this.scoreValue = Config.boss.score;

        this.currentPhase = 0;
        this.lastShootTime = 0;
        this.isDestroyed = false;  // Prevent multiple destructions

        // Movement
        this.movementDirection = 1;
        this.startX = x;
        this.moveRange = 150;
        this.entranceComplete = false;  // Track when entrance is done

        // Scale up for boss (made even bigger)
        this.setScale(3.5);

        // Entrance animation
        this.y = -100;
        scene.tweens.add({
            targets: this,
            y: 100,
            duration: 2000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                // Enable world bounds and mark entrance complete
                this.setCollideWorldBounds(true);
                this.entranceComplete = true;
                console.log('[Boss] Entrance complete, starting horizontal movement');
            }
        });

        // Projectile group
        this.projectiles = scene.physics.add.group({
            classType: EnemyProjectile,
            maxSize: 30,
            runChildUpdate: true
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Only move horizontally after entrance is complete
        if (this.entranceComplete && !this.isDestroyed) {
            // Horizontal movement using velocity
            this.setVelocityX(this.movementDirection * this.speed);

            // Check boundaries and reverse direction
            if (this.x <= this.startX - this.moveRange && this.movementDirection === -1) {
                this.movementDirection = 1;
            } else if (this.x >= this.startX + this.moveRange && this.movementDirection === 1) {
                this.movementDirection = -1;
            }
        }

        // Update phase based on health
        this.updatePhase();

        // Shooting
        this.tryShoot(time);
    }

    updatePhase() {
        const healthPercent = (this.health / this.maxHealth) * 100;
        const phases = Config.boss.phases;

        for (let i = phases.length - 1; i >= 0; i--) {
            if (healthPercent <= phases[i].healthThreshold) {
                if (this.currentPhase !== i) {
                    this.currentPhase = i;
                    this.onPhaseChange(i);
                }
                break;
            }
        }
    }

    onPhaseChange(phase) {
        // Visual feedback for phase change
        const textureName = `boss-${phase + 1}`;

        // Only change texture if it exists
        if (this.scene.textures.exists(textureName)) {
            this.setTexture(textureName);
        }

        // Flash effect
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });

        // Screen shake
        this.scene.cameras.main.shake(300, 0.008);

        // Phase notification
        const text = this.scene.add.text(
            Config.width / 2,
            Config.height / 2,
            `PHASE ${phase + 1}!`,
            {
                fontSize: '48px',
                fill: '#ff0000',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            }
        );
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

        this.scene.sound.play('explosion', { volume: 0.5, rate: 0.8 });
    }

    tryShoot(time) {
        const phase = Config.boss.phases[this.currentPhase];
        const shootDelay = phase.shootDelay;

        if (time > this.lastShootTime + shootDelay) {
            this.shoot(phase.pattern);
            this.lastShootTime = time;
        }
    }

    shoot(pattern) {
        const player = this.scene.player;
        if (!player || !player.active) return;

        switch (pattern) {
            case 0:
                // Single shot at player
                this.fireProjectile(player.x, player.y);
                break;

            case 1:
                // Triple spread
                this.fireProjectile(player.x - 50, player.y);
                this.fireProjectile(player.x, player.y);
                this.fireProjectile(player.x + 50, player.y);
                break;

            case 2:
                // Five-way spread
                for (let i = -2; i <= 2; i++) {
                    const offsetX = i * 40;
                    this.fireProjectile(player.x + offsetX, player.y);
                }
                break;
        }

        this.scene.sound.play('shoot', { volume: 0.4, rate: 0.7 });
    }

    fireProjectile(targetX, targetY) {
        const projectile = this.projectiles.get();
        if (projectile) {
            projectile.fire(this.x, this.y + 40, targetX, targetY);
        }
    }

    takeDamage(damage) {
        // Prevent damage if already destroyed
        if (this.isDestroyed) {
            return false;
        }

        this.health -= damage;

        console.log(`[Boss] Taking ${damage} damage. Health: ${this.health}/${this.maxHealth}`);

        // Flash white when hit
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (this.active) {  // Only clear tint if still active
                this.clearTint();
            }
        });

        // Update health bar
        if (this.scene.updateBossHealth) {
            this.scene.updateBossHealth(this.health, this.maxHealth);
        }

        if (this.health <= 0 && !this.isDestroyed) {
            console.log(`[Boss] Health depleted, exploding...`);
            this.isDestroyed = true;
            this.explode();
            return true; // Boss destroyed
        }

        return false;
    }

    explode() {
        console.log(`[Boss] explode() called`);

        // Capture references before callbacks (this will be destroyed)
        const scene = this.scene;
        const bossX = this.x;
        const bossY = this.y;

        // Stop all movement
        this.setVelocity(0, 0);

        // Disable boss physics immediately to prevent further collisions
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;

        // Epic explosion sequence
        for (let i = 0; i < 8; i++) {
            scene.time.delayedCall(i * 150, () => {
                const offsetX = Phaser.Math.Between(-50, 50);
                const offsetY = Phaser.Math.Between(-50, 50);
                const explosion = scene.add.sprite(
                    bossX + offsetX,
                    bossY + offsetY,
                    'explosion1'
                );
                explosion.setScale(1.5);
                explosion.play('explode');
                explosion.on('animationcomplete', () => explosion.destroy());

                scene.sound.play('explosion', { volume: 0.5 });
            });
        }

        // Camera shake
        scene.cameras.main.shake(1000, 0.015);

        // Screen flash
        const flash = scene.add.rectangle(
            Config.width / 2,
            Config.height / 2,
            Config.width,
            Config.height,
            0xffffff,
            0.6
        );
        flash.setDepth(250);
        flash.setScrollFactor(0);  // Fix flash to camera

        scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,  // Reduced from 800ms
            ease: 'Power2',
            onComplete: () => {
                console.log('[Boss] Flash destroyed');
                flash.destroy();
            }
        });

        // Victory text
        scene.time.delayedCall(500, () => {
            const text = scene.add.text(
                Config.width / 2,
                Config.height / 2,
                'BOSS DEFEATED!',
                {
                    fontSize: '56px',
                    fill: '#00ff00',
                    fontFamily: 'monospace',
                    fontStyle: 'bold'
                }
            );
            text.setOrigin(0.5);
            text.setDepth(200);
            text.setScrollFactor(0);

            scene.tweens.add({
                targets: text,
                scaleX: 1.3,
                scaleY: 1.3,
                alpha: 0,
                duration: 2000,
                onComplete: () => text.destroy()
            });
        });

        // Add massive score
        if (scene.scoreManager) {
            // Boss score doesn't use combo, just add flat bonus
            scene.scoreManager.score += this.scoreValue;
        }

        // Notify wave manager after a delay (let effects play)
        scene.time.delayedCall(1500, () => {
            console.log('[Boss] Notifying wave manager of boss defeat');
            if (scene.waveManager) {
                scene.waveManager.onBossDefeated();
            }
        });

        // Drop guaranteed power-up
        scene.time.delayedCall(200, () => {
            const types = ['weapon', 'shield', 'bomb'];
            for (let type of types) {
                const powerUp = new PowerUp(
                    scene,
                    bossX + Phaser.Math.Between(-40, 40),
                    bossY,
                    type
                );
                scene.powerUps.add(powerUp);
            }
        });

        this.destroy();
    }

    getProjectiles() {
        return this.projectiles;
    }
}
