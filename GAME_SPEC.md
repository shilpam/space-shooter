# Retro Space Shooter - Game Design Specification

## Project Overview
A retro-style top-down space shooter built with Phaser.js featuring progressive difficulty waves, power-ups, boss battles, and a combo scoring system. Classic arcade-inspired gameplay with modern polish.

## Technology Stack
- **Framework**: Phaser.js 3 (2D game framework)
- **Language**: JavaScript/TypeScript
- **Platform**: Web (HTML5)
- **Resolution**: 800x600 (scalable)
- **Target FPS**: 60

---

## Core Requirements

### Gameplay
1. **Player Control**
   - WASD or Arrow keys for 8-directional movement
   - Mouse or Spacebar for shooting
   - Smooth acceleration and deceleration
   - Screen boundary constraints

2. **Combat System**
   - Multiple weapon types with upgrades
   - Enemy AI with different movement patterns
   - Hit detection and damage system
   - Visual feedback for hits and destruction

3. **Power-up System**
   - Weapon upgrades (spread shot, lasers, missiles)
   - Shield power-ups
   - Speed boosts
   - Screen-clearing bombs

4. **Scoring & Combo System**
   - Points for enemy destruction
   - Combo multiplier for consecutive kills
   - Multiplier resets on taking damage
   - High score persistence

5. **Wave System**
   - Progressive difficulty scaling
   - Different enemy formations
   - Wave completion bonuses
   - Boss battles every 5 waves

6. **Boss Battles**
   - Multi-phase boss encounters
   - Unique attack patterns
   - Health bars
   - Increased rewards

### Visual & Audio
- Parallax scrolling space backgrounds
- Particle effects for explosions and weapons
- Screen shake on impacts
- Sound effects for all actions
- Retro pixel art aesthetic

### UI Elements
- Health/Shield display
- Current weapon indicator
- Score and combo multiplier
- Wave number
- Game over screen with restart
- Pause menu

---

## Asset Mapping

### Player Ship
**Primary**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Ship/ship1.png`
- Alternative ships available: ship1-10.png for selection/upgrades
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/ship.png`

### Enemies

#### Small Enemies (Fast, Low HP)
- **Source**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemySmall/`
  - `enemy-small1.png`
  - `enemy-small2.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-small.png`

#### Medium Enemies (Balanced)
- **Source**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Enemy Medium/`
  - `enemy-medium1.png`
  - `enemy-medium2.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-medium.png`

#### Large Enemies (Slow, High HP)
- **Source**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/EnemyBig/`
  - `enemy-big1.png`
  - `enemy-big2.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/enemy-big.png`

#### Boss Enemy
- **Source**: `Legacy Collection/Assets/Misc/top-down-boss/PNG/sprites/`
- **Spritesheet**: `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/`

### Weapons & Projectiles

#### Player Weapons
- **Laser Bolts**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Laser Bolts/`
  - `laser-bolts1.png` (basic shot)
  - `laser-bolts2.png` (upgraded)
  - `laser-bolts3.png` (advanced)
  - `laser-bolts4.png` (maximum)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/laser-bolts.png`

#### Special Weapons
- **Bolt Shot**: `Legacy Collection/Assets/Misc/Warped shooting fx/Bolt/Sprites/`
- **Pulse Cannon**: `Legacy Collection/Assets/Misc/Warped shooting fx/Pulse/Sprites/`
- **Waveform Beam**: `Legacy Collection/Assets/Misc/Warped shooting fx/waveform/Sprites/`
- **Charged Shot**: `Legacy Collection/Assets/Misc/Warped shooting fx/charged/Sprites/`

#### Enemy Projectiles
- **Basic**: `Legacy Collection/Assets/Misc/EnemyProjectile/spritesheet.png`
- **Crossed Pattern**: `Legacy Collection/Assets/Misc/Warped shooting fx/crossed/Sprites/`

### Effects

#### Explosions (Player/Enemy Death)
- **Primary Explosion**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Explosion/`
  - `explosion1.png` through `explosion5.png`
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/explosion.png`

#### Additional Explosions (Variety)
- **Type A**: `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-a/Sprites/`
- **Type B**: `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-b/Sprites/`
- **Type C**: `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-c/Sprites/`
- **Large Explosion**: `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-e/Sprites/` (22 frames for bosses)

#### Hit Effects
- **Impact Flash**: `Legacy Collection/Assets/Misc/Warped shooting fx/hits/hits-1/Sprites/`
- **Spark Hit**: `Legacy Collection/Assets/Misc/Warped shooting fx/hits/Hits-2/Sprites/`
- **Energy Hit**: `Legacy Collection/Assets/Misc/Warped shooting fx/hits/Hits-3/Sprites/`
- **Shield Impact**: `Legacy Collection/Assets/Misc/Warped shooting fx/spark/Sprites/`

### Power-ups
- **Source**: `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/`
  - `power-up1.png` (weapon upgrade)
  - `power-up2.png` (shield)
  - `power-up3.png` (speed boost)
  - `power-up4.png` (bomb/special)
- **Spritesheet**: `Legacy Collection/Assets/Packs/SpaceShipShooter/spritesheets/power-up.png`

### Obstacles

#### Asteroids
- **Source**: `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/cut-out-sprites/`
  - `asteroid-01.png` through `asteroid-05.png`
- **Alternative**: `Legacy Collection/Assets/Packs/asteroid-fighter/PNG/asteroids/`
  - `asteroid-1.png` through `asteroid-5.png`

### Backgrounds

#### Space Background (Parallax Layers)
- **Primary**: `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/`
  - `blue-back.png` (far background)
  - `blue-stars.png` (star layer)
  - `prop-planet-big.png` (large planet)
  - `prop-planet-small.png` (small planet)

#### Alternative Background
- **Source**: `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/`
  - `parallax-space-backgound.png`
  - `parallax-space-stars.png`
  - `parallax-space-far-planets.png`
  - `parallax-space-big-planet.png`
  - `parallax-space-ring-planet.png`

#### Environmental Props
- **Planets**: `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/cut-out-sprites/planet.png`
- **Eclipse Effects**:
  - `eclipse-1.png`
  - `eclipse-2.png`

### Sound Effects
- **Location**: `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Sound FX/`
  - `explosion.wav`
  - `hit.wav`
  - `shot 1.wav`
  - `shot 2.wav`

---

## Milestone 1: Core Mechanics (Week 1-2)
**Goal**: Playable game loop with movement, shooting, and basic enemies

### Features
- [x] Project setup with Phaser.js
- [x] Player ship rendering and smooth 8-directional movement
- [x] Basic shooting mechanic (single bullet type)
- [x] Simple enemy spawning (small enemies only)
- [x] Enemy movement patterns (straight down, sine wave)
- [x] Collision detection (bullets vs enemies, enemies vs player)
- [x] Health system (player has 3 lives)
- [x] Basic explosion effects
- [x] Simple parallax background (2 layers)
- [x] Game over state and restart

### Assets Used
- **Player**: `ship1.png`
- **Weapon**: `laser-bolts1.png`
- **Enemy**: `enemy-small1.png`, `enemy-small2.png`
- **Explosion**: `explosion1-5.png`
- **Background**: `blue-back.png`, `blue-stars.png`
- **SFX**: `shot 1.wav`, `explosion.wav`, `hit.wav`

### Playable Demo
- Player can move and shoot
- Enemies spawn in waves and move toward player
- Enemies can be destroyed
- Player takes damage and dies after 3 hits
- Game can be restarted

**Success Criteria**: 5 minutes of engaging combat gameplay

---

## Milestone 2: Power-ups, Waves & Scoring (Week 3-4)
**Goal**: Complete progression system with power-ups and increasing difficulty

### Features
- [x] Weapon upgrade system (3 tiers)
  - Tier 1: Single shot
  - Tier 2: Double shot
  - Tier 3: Triple spread shot
- [x] Power-up drops from enemies
  - Weapon upgrades
  - Shield (extra hit point)
  - Speed boost (temporary)
- [x] Multiple enemy types (small, medium, large)
- [x] Advanced enemy movement patterns
  - Dive attacks
  - Formation flying
  - Tracking/homing
- [x] Wave system (endless progression)
- [x] Score and combo system
  - Base points per enemy type
  - Combo multiplier (x2, x4, x8, x16)
  - Combo breaks on taking damage
- [x] UI implementation
  - Health bar
  - Current weapon display
  - Score counter
  - Wave number
  - Combo multiplier indicator
- [x] More explosion varieties
- [x] Hit effects and screen shake
- [x] Enhanced parallax (4+ layers with planets)
- [x] Asteroid obstacles

### Assets Used (Additional)
- **Weapons**: `laser-bolts2.png`, `laser-bolts3.png`, `Bolt/`, `Pulse/`
- **Enemies**: `enemy-medium1-2.png`, `enemy-big1-2.png`
- **Power-ups**: All `power-up1-4.png`
- **Explosions**: `explosion-1-a/`, `explosion-1-b/`, `explosion-1-c/`
- **Hit Effects**: `hits-1/`, `hits-2/`, `hits-3/`, `spark/`
- **Background**: All parallax layers + planets
- **Obstacles**: `asteroid-01.png` through `asteroid-05.png`

### Playable Demo
- Multiple weapon tiers with visual differences
- Power-ups drop and can be collected
- 3 enemy types with different behaviors
- Score increases with combo multiplier
- UI shows all game stats
- Difficulty increases every wave

**Success Criteria**: 15 minutes of gameplay with clear progression and risk/reward decisions

---

## Milestone 3: Boss Battles & Polish (Week 5-6)
**Goal**: Complete game with boss encounters and professional polish

### Features
- [x] Boss battle system
  - Spawns every 5 waves
  - Multi-phase bosses (health thresholds change behavior)
  - Boss health bar
  - Unique attack patterns per phase
  - Boss-specific projectiles
- [x] Special weapons
  - Charged shot (hold to charge)
  - Waveform beam (continuous damage)
  - Screen-clearing bomb (power-up)
- [x] Enemy projectiles (enemies shoot back)
- [x] Advanced particle effects
  - Engine thrust
  - Bullet trails
  - Shield shimmer
  - Warp effects
- [x] Polish features
  - Main menu screen
  - Pause menu
  - Settings (volume, controls)
  - High score persistence (localStorage)
  - Death animation for player
  - Victory fanfare for boss kills
- [x] Difficulty balancing
  - Playtesting and tweaking spawn rates
  - Enemy health scaling
  - Power-up drop rates
- [x] Sound design
  - Background music
  - Layered sound effects
  - UI sounds

### Assets Used (Additional)
- **Boss**: `top-down-boss/` sprites
- **Special Weapons**: `charged/`, `waveform/`, `crossed/`
- **Enemy Projectiles**: `EnemyProjectile/spritesheet.png`
- **Hit Effects**: All remaining hit variations
- **Explosions**: `explosion-1-e/` (22-frame large explosion)
- **Additional Ships**: `ship2-10.png` (unlockables/variants)

### Playable Demo
- Complete game flow: Menu → Waves → Boss → Victory/Death → Restart
- Boss encounters every 5 waves with dramatic battles
- Special weapons add variety
- All visual polish implemented
- Complete sound design
- Balanced and fair difficulty curve

**Success Criteria**: 30+ minutes of replayable content with satisfying boss encounters and a polished presentation

---

## Post-Launch (Optional Enhancements)
- Leaderboard system
- Multiple player ship choices
- Endless mode vs Story mode
- Different backgrounds per wave milestone
- More boss varieties
- Local co-op multiplayer
- Mobile touch controls
- Achievement system

---

## Development Guidelines

### Code Structure
```
/src
  /scenes
    - BootScene.js        # Asset loading
    - MenuScene.js        # Main menu
    - GameScene.js        # Main gameplay
    - GameOverScene.js    # Game over screen
  /entities
    - Player.js           # Player ship class
    - Enemy.js            # Enemy base class
    - Boss.js             # Boss class
    - Projectile.js       # Bullet class
    - PowerUp.js          # Power-up class
  /managers
    - WaveManager.js      # Wave spawning logic
    - ScoreManager.js     # Scoring and combos
    - AudioManager.js     # Sound management
  /utils
    - Config.js           # Game constants
    - Helpers.js          # Utility functions
  - main.js              # Phaser game config
```

### Performance Targets
- 60 FPS on modern browsers
- Efficient object pooling for bullets/enemies
- Max 200 active game objects simultaneously
- Asset compression for fast loading

### Testing Checklist
- [ ] Movement feels responsive
- [ ] Hitboxes feel fair
- [ ] Power-ups are valuable and noticeable
- [ ] Difficulty curve is balanced
- [ ] Boss battles are challenging but beatable
- [ ] UI is readable and non-intrusive
- [ ] Sound levels are balanced
- [ ] Game is fun to replay

---

## Success Metrics
- **Milestone 1**: Core loop is functional and fun
- **Milestone 2**: Player wants to beat their high score
- **Milestone 3**: Player can complete 5+ waves and beat a boss

## Timeline
- **Milestone 1**: Weeks 1-2 (Core Mechanics)
- **Milestone 2**: Weeks 3-4 (Systems & Progression)
- **Milestone 3**: Weeks 5-6 (Boss & Polish)
- **Total**: 6 weeks to complete game

---

*All assets sourced from Legacy Collection with proper licensing.*
