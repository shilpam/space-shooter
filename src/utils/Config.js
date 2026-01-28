// Game Configuration
const Config = {
    // Display
    width: 800,
    height: 600,

    // Player
    player: {
        speed: 200,
        acceleration: 600,
        drag: 500,
        maxLives: 3,
        maxShield: 2,
        shootDelay: 200, // milliseconds between shots
        weaponLevel: 1, // 1 = single, 2 = double, 3 = triple
    },

    // Projectiles
    projectile: {
        speed: 400,
        damage: 1,
    },

    // Weapons
    weapons: {
        level1: { // Single shot
            bullets: 1,
            spread: 0,
            shootDelay: 200,
        },
        level2: { // Double shot
            bullets: 2,
            spread: 20,
            shootDelay: 180,
        },
        level3: { // Triple shot
            bullets: 3,
            spread: 25,
            shootDelay: 150,
        },
    },

    // Enemies
    enemy: {
        small: {
            health: 1,
            speed: 100,
            score: 100,
            powerUpChance: 0.15,
        },
        medium: {
            health: 3,
            speed: 80,
            score: 250,
            powerUpChance: 0.25,
        },
        large: {
            health: 5,
            speed: 60,
            score: 500,
            powerUpChance: 0.4,
        },
        spawnDelay: 2000, // milliseconds between enemy spawns
        initialSpawnCount: 3,
    },

    // Power-ups
    powerUp: {
        fallSpeed: 80,
        types: {
            weapon: { sprite: 'power-up1', duration: 0 }, // Permanent upgrade
            shield: { sprite: 'power-up2', duration: 0 }, // Adds shield
            speed: { sprite: 'power-up3', duration: 5000 }, // Temporary 5 seconds
            bomb: { sprite: 'power-up4', duration: 0 }, // Instant effect
        },
    },

    // Asteroids
    asteroid: {
        health: 3,
        speed: 50,
        score: 50,
        spawnChance: 0.3,
    },

    // Waves
    waves: {
        difficultyIncrease: 1.1, // Multiplier per wave
        enemyCountBase: 5,
        enemyCountIncrease: 2,
    },

    // Combo System
    combo: {
        timeout: 3000, // milliseconds before combo resets
        multipliers: [1, 2, 4, 8, 16], // x1, x2, x4, x8, x16
        killsForNextLevel: [0, 3, 6, 10, 15], // Kills needed for each multiplier
    },

    // Physics
    physics: {
        gravity: 0,
    },

    // Background
    background: {
        scrollSpeed: 50,
    },

    // Boss
    boss: {
        health: 100,
        speed: 40,
        score: 5000,
        phases: [
            { healthThreshold: 100, shootDelay: 2000, pattern: 0 }, // Phase 1
            { healthThreshold: 66, shootDelay: 1500, pattern: 1 },  // Phase 2
            { healthThreshold: 33, shootDelay: 1000, pattern: 2 },  // Phase 3
        ],
        spawnWave: 5, // Boss every 5 waves
    },

    // Enemy Projectiles
    enemyProjectile: {
        speed: 200,
        damage: 1,
        shootChance: {
            small: 0,      // Small enemies don't shoot
            medium: 0.015, // 1.5% chance per frame
            large: 0.025,  // 2.5% chance per frame
            boss: 1,       // Boss shoots on pattern
        },
    },
};
