// PowerUp class - Collectible items
class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        const spriteKey = Config.powerUp.types[type].sprite;
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2.5); // Make power-ups bigger

        this.type = type; // 'weapon', 'shield', 'speed', 'bomb'
        this.duration = Config.powerUp.types[type].duration;

        this.setVelocityY(Config.powerUp.fallSpeed);

        // Gentle floating animation
        scene.tweens.add({
            targets: this,
            y: this.y + 10,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gentle rotation
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulse scale effect
        scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Remove when off screen
        if (this.y > Config.height + 50) {
            this.destroy();
        }
    }

    collect(player) {
        switch (this.type) {
            case 'weapon':
                player.upgradeWeapon();
                break;

            case 'shield':
                player.addShield();
                break;

            case 'speed':
                player.applySpeedBoost(this.duration);
                break;

            case 'bomb':
                player.activateBomb();
                break;
        }

        // Visual feedback
        const text = this.scene.add.text(this.x, this.y, this.getCollectText(), {
            fontSize: '16px',
            fill: this.getCollectColor(),
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });

        this.scene.sound.play('hit', { volume: 0.3, rate: 1.5 });
        this.destroy();
    }

    getCollectText() {
        const texts = {
            weapon: 'WEAPON UP!',
            shield: 'SHIELD!',
            speed: 'SPEED!',
            bomb: 'BOMB!'
        };
        return texts[this.type] || 'POWER UP!';
    }

    getCollectColor() {
        const colors = {
            weapon: '#ff00ff',
            shield: '#00ffff',
            speed: '#ffff00',
            bomb: '#ff0000'
        };
        return colors[this.type] || '#ffffff';
    }
}
