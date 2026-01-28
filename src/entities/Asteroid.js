// Asteroid class - Destructible obstacles
class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Randomly choose asteroid sprite
        const variant = Phaser.Math.Between(1, 5);
        const spriteKey = `asteroid-0${variant}`;
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = Config.asteroid.health;
        this.scoreValue = Config.asteroid.score;

        // Set velocity
        this.setVelocityY(Config.asteroid.speed);

        // Slow rotation
        this.setAngularVelocity(Phaser.Math.Between(-50, 50));

        // Scale randomly for variety (made bigger)
        const scale = Phaser.Math.FloatBetween(2.0, 2.8);
        this.setScale(scale);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Remove when off screen
        if (this.y > Config.height + 100) {
            // Don't notify wave manager - asteroids don't count for wave completion
            this.destroy();
        }
    }

    takeDamage(damage) {
        this.health -= damage;

        // Flash and shake when hit
        this.setTint(0xffffff);
        this.scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-3, 3),
            duration: 50,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.clearTint();
            }
        });

        if (this.health <= 0) {
            this.explode();
            return true; // Asteroid destroyed
        }

        return false;
    }

    explode() {
        // Create explosion - smaller than enemies
        const explosion = this.scene.add.sprite(this.x, this.y, 'explosion1');
        explosion.setScale(0.7);
        explosion.play('explode');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });

        this.scene.sound.play('explosion', { volume: 0.3, rate: 1.2 });

        // Add to score
        if (this.scene.scoreManager) {
            this.scene.scoreManager.addKill(this.scoreValue);
        }

        // Small chance to drop power-up
        if (Math.random() < 0.1) {
            this.dropPowerUp();
        }

        this.destroy();
    }

    dropPowerUp() {
        const types = ['weapon', 'shield', 'speed', 'bomb'];
        const type = Phaser.Math.RND.pick(types);
        const powerUp = new PowerUp(this.scene, this.x, this.y, type);
        this.scene.powerUps.add(powerUp);
    }
}
