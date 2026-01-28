// EnemyProjectile class - Enemy bullets
class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser-bolt'); // Using same sprite, can tint red

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2.0); // Make enemy bullets bigger
        this.setActive(false);
        this.setVisible(false);
        this.setTint(0xff4444); // Red tint to distinguish from player bullets

        this.damage = Config.enemyProjectile.damage;
    }

    fire(x, y, targetX, targetY) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        // Calculate angle to target (player)
        const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);

        // Set velocity toward target
        this.setVelocity(
            Math.cos(angle) * Config.enemyProjectile.speed,
            Math.sin(angle) * Config.enemyProjectile.speed
        );

        // Rotate sprite to face direction
        this.setRotation(angle + Math.PI / 2);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Deactivate when off screen
        if (this.y > Config.height + 10 || this.y < -10 ||
            this.x < -10 || this.x > Config.width + 10) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
