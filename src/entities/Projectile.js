// Projectile class for bullets
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser-bolt');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2.0); // Make bullets bigger
        this.setActive(false);
        this.setVisible(false);

        this.damage = Config.projectile.damage;
    }

    fire(x, y) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-Config.projectile.speed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Deactivate when off screen
        if (this.y < -10) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
