// Shoot Button for mobile controls
class ShootButton {
    constructor(scene, x, y, radius = 50) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isPressed = false;
        this.pointer = null;

        this.createGraphics();
        this.setupInput();
    }

    createGraphics() {
        // Outer circle
        this.outerCircle = this.scene.add.circle(this.x, this.y, this.radius, 0xff0000, 0.3);
        this.outerCircle.setDepth(1000);
        this.outerCircle.setScrollFactor(0);

        // Inner circle (button)
        this.button = this.scene.add.circle(this.x, this.y, this.radius * 0.7, 0xff3333, 0.6);
        this.button.setDepth(1001);
        this.button.setScrollFactor(0);

        // Icon (triangle pointing up)
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillTriangle(
            0, -15,
            -10, 5,
            10, 5
        );
        graphics.setPosition(this.x, this.y);
        graphics.setDepth(1002);
        graphics.setScrollFactor(0);
        this.icon = graphics;
    }

    setupInput() {
        this.scene.input.on('pointerdown', (pointer) => {
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.x, this.y);
            if (distance < this.radius) {
                this.isPressed = true;
                this.pointer = pointer;
                this.button.setAlpha(0.9);
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            if (this.pointer === pointer) {
                this.isPressed = false;
                this.pointer = null;
                this.button.setAlpha(0.6);
            }
        });

        // Also reset if pointer moves away
        this.scene.input.on('pointermove', (pointer) => {
            if (this.pointer === pointer) {
                const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.x, this.y);
                if (distance > this.radius * 1.5) {
                    this.isPressed = false;
                    this.pointer = null;
                    this.button.setAlpha(0.6);
                }
            }
        });
    }

    isDown() {
        return this.isPressed;
    }

    setVisible(visible) {
        this.outerCircle.setVisible(visible);
        this.button.setVisible(visible);
        this.icon.setVisible(visible);
    }

    destroy() {
        this.outerCircle.destroy();
        this.button.destroy();
        this.icon.destroy();
    }
}
