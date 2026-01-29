// Virtual Joystick for mobile controls
class VirtualJoystick {
    constructor(scene, x, y, radius = 60) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.thumbRadius = 30;

        this.isActive = false;
        this.startX = x;
        this.startY = y;
        this.thumbX = x;
        this.thumbY = y;

        this.pointer = null;

        // Normalized direction values
        this.directionX = 0;
        this.directionY = 0;

        this.createGraphics();
        this.setupInput();
    }

    createGraphics() {
        // Base circle
        this.base = this.scene.add.circle(this.x, this.y, this.radius, 0xffffff, 0.3);
        this.base.setDepth(1000);
        this.base.setScrollFactor(0);

        // Thumb circle
        this.thumb = this.scene.add.circle(this.x, this.y, this.thumbRadius, 0xffffff, 0.6);
        this.thumb.setDepth(1001);
        this.thumb.setScrollFactor(0);
    }

    setupInput() {
        // Listen for pointer events in the joystick area (larger activation area)
        this.scene.input.on('pointerdown', (pointer) => {
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.x, this.y);
            if (distance < this.radius * 2) {
                this.isActive = true;
                this.pointer = pointer;
                this.startX = this.x;
                this.startY = this.y;
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.isActive && this.pointer === pointer) {
                this.updateThumbPosition(pointer.x, pointer.y);
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            if (this.pointer === pointer) {
                this.reset();
            }
        });
    }

    updateThumbPosition(x, y) {
        const dx = x - this.startX;
        const dy = y - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {
            // Constrain to radius
            const angle = Math.atan2(dy, dx);
            this.thumbX = this.startX + Math.cos(angle) * this.radius;
            this.thumbY = this.startY + Math.sin(angle) * this.radius;
        } else {
            this.thumbX = x;
            this.thumbY = y;
        }

        // Update thumb position
        this.thumb.setPosition(this.thumbX, this.thumbY);

        // Calculate normalized direction (-1 to 1)
        this.directionX = (this.thumbX - this.startX) / this.radius;
        this.directionY = (this.thumbY - this.startY) / this.radius;
    }

    reset() {
        this.isActive = false;
        this.pointer = null;
        this.thumbX = this.startX;
        this.thumbY = this.startY;
        this.thumb.setPosition(this.x, this.y);
        this.directionX = 0;
        this.directionY = 0;
    }

    getDirection() {
        return {
            x: this.directionX,
            y: this.directionY
        };
    }

    setVisible(visible) {
        this.base.setVisible(visible);
        this.thumb.setVisible(visible);
    }

    destroy() {
        this.base.destroy();
        this.thumb.destroy();
    }
}
