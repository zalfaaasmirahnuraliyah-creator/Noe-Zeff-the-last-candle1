import {
  CharacterState,
  CandleState,
  Platform,
  WindHazard,
  ShadowMonster,
  FallingHazard,
  PressurePlate,
  GateDoor,
  CollectibleKey,
  WaxPickup,
  CollapsingFloor,
  GameState,
  SectionMarker,
  BrightnessMode,
} from './types';
import { createInitialLevelData, FLOOR_Y, SECTION_MARKERS } from './levelData';
import { sound } from './audio';

export interface GameEngineState {
  noe: CharacterState;
  zeff: CharacterState;
  candle: CandleState;
  gameState: GameState;
  brightnessMode: BrightnessMode;
  cameraX: number;
  keysHeld: Set<string>;
  time: number;
  keysCollected: string[];
  currentSection: SectionMarker;
  notification: string | null;
  notificationTimer: number;
  // Level entities
  platforms: Platform[];
  windHazards: WindHazard[];
  shadowMonsters: ShadowMonster[];
  fallingHazards: FallingHazard[];
  pressurePlates: PressurePlate[];
  gateDoors: GateDoor[];
  collectibleKeys: CollectibleKey[];
  waxPickups: WaxPickup[];
  collapsingFloors: CollapsingFloor[];
}

export function createInitialGameState(): GameEngineState {
  const level = createInitialLevelData();

  const noe: CharacterState = {
    x: 80,
    y: FLOOR_Y - 48,
    vx: 0,
    vy: 0,
    width: 26,
    height: 48,
    isGrounded: true,
    facing: 'right',
    isMoving: false,
    isJumping: false,
    isBracing: false,
    isProtecting: false,
    animTimer: 0,
    animFrame: 0,
  };

  const zeff: CharacterState = {
    x: 40,
    y: FLOOR_Y - 36,
    vx: 0,
    vy: 0,
    width: 22,
    height: 36,
    isGrounded: true,
    facing: 'right',
    isMoving: false,
    isJumping: false,
    isBracing: false,
    isProtecting: false,
    animTimer: 0,
    animFrame: 0,
  };

  const candle: CandleState = {
    stability: 100,
    maxStability: 100,
    flickerIntensity: 0.2,
    flameAngle: 0,
    lightRadius: 360,
    isUnderAttack: false,
    isExposedToWind: false,
    isProtectedByNoe: false,
  };

  return {
    noe,
    zeff,
    candle,
    gameState: 'playing',
    brightnessMode: 'bright',
    cameraX: 0,
    keysHeld: new Set(),
    time: 0,
    keysCollected: [],
    currentSection: SECTION_MARKERS[0],
    notification: 'GUIDE BOTH THROUGH THE GOTHIC HALL',
    notificationTimer: 4.5,
    platforms: level.platforms,
    windHazards: level.windHazards,
    shadowMonsters: level.shadowMonsters,
    fallingHazards: level.fallingHazards,
    pressurePlates: level.pressurePlates,
    gateDoors: level.gateDoors,
    collectibleKeys: level.collectibleKeys,
    waxPickups: level.waxPickups,
    collapsingFloors: level.collapsingFloors,
  };
}

export class GameEngine {
  public state: GameEngineState;
  private footstepTimerNoe = 0;
  private footstepTimerZeff = 0;
  private flickerSoundTimer = 0;

  constructor() {
    this.state = createInitialGameState();
  }

  public reset() {
    this.state = createInitialGameState();
  }

  public handleKeyDown(code: string) {
    sound.ensureRunning();
    this.state.keysHeld.add(code);
  }

  public handleKeyUp(code: string) {
    this.state.keysHeld.delete(code);
  }

  public update(dt: number) {
    if (this.state.gameState !== 'playing') return;

    // Cap delta time to prevent physics tunneling
    const clampedDt = Math.min(dt, 0.05);
    this.state.time += clampedDt;

    // 1. Process Input for NOE (WASD / Space)
    this.updateNoeInput(clampedDt);

    // 2. Process Input for ZEFF (Arrow keys / Enter)
    this.updateZeffInput(clampedDt);

    // 3. Physics & Collisions
    this.updatePhysics(this.state.noe, clampedDt);
    this.updatePhysics(this.state.zeff, clampedDt);

    // 4. Update Collapsing Floors
    this.updateCollapsingFloors(clampedDt);

    // 5. Update Pressure Plates & Gates
    this.updatePressurePlatesAndDoors(clampedDt);

    // 6. Update Falling Hazards (Chandeliers)
    this.updateFallingHazards(clampedDt);

    // 7. Update Wind & NOE Blocking Mechanics
    this.updateWindHazards(clampedDt);

    // 8. Update Shadow Monsters AI & Defense
    this.updateShadowMonsters(clampedDt);

    // 9. Collectibles (Keys & Sacred Wax)
    this.updateCollectibles();

    // 10. Candle Stability Calculations
    this.updateCandle(clampedDt);

    // 11. Camera Following
    this.updateCamera(clampedDt);

    // 12. Check Current Section & Notification Timers
    this.updateSections(clampedDt);

    // 13. Win / Loss Condition Check
    this.checkWinLoss();
  }

  private updateNoeInput(dt: number) {
    const noe = this.state.noe;
    const keys = this.state.keysHeld;

    const moveLeft = keys.has('KeyA');
    const moveRight = keys.has('KeyD');
    const jump = keys.has('KeyW');
    const brace = keys.has('KeyS') || keys.has('Space');

    noe.isBracing = brace;

    const accel = 14;
    const maxSpeed = brace ? 1.4 : 2.8;

    if (moveLeft && !moveRight) {
      noe.vx = Math.max(-maxSpeed, noe.vx - accel * dt);
      noe.facing = 'left';
      noe.isMoving = true;
    } else if (moveRight && !moveLeft) {
      noe.vx = Math.min(maxSpeed, noe.vx + accel * dt);
      noe.facing = 'right';
      noe.isMoving = true;
    } else {
      noe.vx *= 0.72;
      if (Math.abs(noe.vx) < 0.1) noe.vx = 0;
      noe.isMoving = false;
    }

    if (jump && noe.isGrounded) {
      noe.vy = -9.2;
      noe.isGrounded = false;
      noe.isJumping = true;
      sound.playFootstep(true);
    }

    // Footsteps
    if (noe.isGrounded && noe.isMoving) {
      this.footstepTimerNoe += dt;
      noe.animTimer += dt * 10;
      noe.animFrame = Math.floor(noe.animTimer);
      if (this.footstepTimerNoe > 0.32) {
        sound.playFootstep(false);
        this.footstepTimerNoe = 0;
      }
    } else {
      this.footstepTimerNoe = 0.2;
      noe.animTimer += dt * 2;
      noe.animFrame = 0;
    }
  }

  private updateZeffInput(dt: number) {
    const zeff = this.state.zeff;
    const keys = this.state.keysHeld;

    const moveLeft = keys.has('ArrowLeft') || keys.has('KeyJ');
    const moveRight = keys.has('ArrowRight') || keys.has('KeyL');
    const jump = keys.has('ArrowUp') || keys.has('KeyI');
    const protect = keys.has('ArrowDown') || keys.has('KeyK');

    zeff.isProtecting = protect;

    const accel = 12;
    const maxSpeed = protect ? 1.2 : 2.4;

    if (moveLeft && !moveRight) {
      zeff.vx = Math.max(-maxSpeed, zeff.vx - accel * dt);
      zeff.facing = 'left';
      zeff.isMoving = true;
    } else if (moveRight && !moveLeft) {
      zeff.vx = Math.min(maxSpeed, zeff.vx + accel * dt);
      zeff.facing = 'right';
      zeff.isMoving = true;
    } else {
      zeff.vx *= 0.72;
      if (Math.abs(zeff.vx) < 0.1) zeff.vx = 0;
      zeff.isMoving = false;
    }

    if (jump && zeff.isGrounded) {
      zeff.vy = -8.6;
      zeff.isGrounded = false;
      zeff.isJumping = true;
      sound.playFootstep(false);
    }

    // Footsteps
    if (zeff.isGrounded && zeff.isMoving) {
      this.footstepTimerZeff += dt;
      zeff.animTimer += dt * 9;
      zeff.animFrame = Math.floor(zeff.animTimer);
      if (this.footstepTimerZeff > 0.35) {
        sound.playFootstep(true);
        this.footstepTimerZeff = 0;
      }
    } else {
      this.footstepTimerZeff = 0.2;
      zeff.animTimer += dt * 2;
      zeff.animFrame = 0;
    }
  }

  private updatePhysics(char: CharacterState, dt: number) {
    const gravity = 22;
    char.vy += gravity * dt;

    // Apply horizontal motion
    char.x += char.vx * 60 * dt;

    // Collide with solid gates
    for (const gate of this.state.gateDoors) {
      if (gate.isOpen) continue;
      const gateBox = {
        x: gate.x,
        y: gate.y,
        width: gate.width,
        height: gate.currentHeight,
      };
      if (this.rectIntersect(char, gateBox)) {
        if (char.vx > 0) {
          char.x = gateBox.x - char.width;
          char.vx = 0;
        } else if (char.vx < 0) {
          char.x = gateBox.x + gateBox.width;
          char.vx = 0;
        }
      }
    }

    // Apply vertical motion
    char.y += char.vy * 60 * dt;
    char.isGrounded = false;

    // Floor and platform collisions
    const allPlatforms: Platform[] = [
      ...this.state.platforms,
      ...this.state.collapsingFloors
        .filter((f) => f.state !== 'collapsed')
        .map((f) => ({ x: f.x, y: f.y, width: f.width, height: f.height, type: 'floor' as const })),
    ];

    for (const plat of allPlatforms) {
      if (
        char.x + char.width > plat.x &&
        char.x < plat.x + plat.width &&
        char.y + char.height >= plat.y &&
        char.y + char.height <= plat.y + 16 &&
        char.vy >= 0
      ) {
        char.y = plat.y - char.height;
        char.vy = 0;
        char.isGrounded = true;
        char.isJumping = false;
        break;
      }
    }
  }

  private updateCollapsingFloors(dt: number) {
    for (const floor of this.state.collapsingFloors) {
      const charOnTop =
        (this.isCharOnFloor(this.state.noe, floor) || this.isCharOnFloor(this.state.zeff, floor));

      if (floor.state === 'stable' && charOnTop) {
        floor.state = 'shaking';
        floor.shakeTimer = 0.75;
        sound.playFootstep(true);
      } else if (floor.state === 'shaking') {
        floor.shakeTimer -= dt;
        if (floor.shakeTimer <= 0) {
          floor.state = 'collapsed';
          floor.shakeTimer = 3.5; // restore after a while if needed
        }
      } else if (floor.state === 'collapsed') {
        floor.shakeTimer -= dt;
        if (floor.shakeTimer <= 0) {
          floor.state = 'stable';
        }
      }
    }
  }

  private isCharOnFloor(char: CharacterState, floor: CollapsingFloor): boolean {
    return (
      char.x + char.width > floor.x &&
      char.x < floor.x + floor.width &&
      Math.abs(char.y + char.height - floor.y) < 4 &&
      char.isGrounded
    );
  }

  private updatePressurePlatesAndDoors(dt: number) {
    for (const plate of this.state.pressurePlates) {
      const noeOnPlate =
        this.state.noe.x + this.state.noe.width > plate.x &&
        this.state.noe.x < plate.x + plate.width &&
        Math.abs(this.state.noe.y + this.state.noe.height - plate.y) < 8;

      const zeffOnPlate =
        this.state.zeff.x + this.state.zeff.width > plate.x &&
        this.state.zeff.x < plate.x + plate.width &&
        Math.abs(this.state.zeff.y + this.state.zeff.height - plate.y) < 8;

      const wasPressed = plate.isPressed;
      plate.isPressed = noeOnPlate || zeffOnPlate;

      if (!wasPressed && plate.isPressed) {
        sound.playDoorOpen();
        this.showNotification('PORTCULLIS LIFTED BY PRESSURE PLATE');
      }

      const connectedDoor = this.state.gateDoors.find((d) => d.id === plate.connectedDoorId);
      if (connectedDoor) {
        if (plate.isPressed) {
          // Open door smoothly
          connectedDoor.currentHeight = Math.max(0, connectedDoor.currentHeight - 90 * dt);
          if (connectedDoor.currentHeight <= 10) {
            connectedDoor.isOpen = true;
          }
        } else if (!connectedDoor.isLocked) {
          // Slowly drop closed
          connectedDoor.currentHeight = Math.min(
            connectedDoor.targetHeight,
            connectedDoor.currentHeight + 60 * dt
          );
          if (connectedDoor.currentHeight > 20) {
            connectedDoor.isOpen = false;
          }
        }
      }
    }

    // Handle locked door that ZEFF unlocks with key
    for (const door of this.state.gateDoors) {
      if (door.isLocked && door.requiresKeyId) {
        const hasKey = this.state.keysCollected.includes(door.requiresKeyId);
        const zeffNearDoor = Math.abs(this.state.zeff.x - door.x) < 55;
        if (hasKey && zeffNearDoor) {
          door.isLocked = false;
          door.isOpen = true;
          door.currentHeight = 0;
          sound.playDoorOpen();
          this.showNotification('ZEFF UNLOCKED THE SANCTUM DOOR!');
        }
      }
    }
  }

  private updateFallingHazards(dt: number) {
    for (const fall of this.state.fallingHazards) {
      if (fall.state === 'hanging') {
        // Trigger if NOE or ZEFF cross trigger point
        if (this.state.noe.x >= fall.triggerX || this.state.zeff.x >= fall.triggerX) {
          fall.state = 'warning';
          fall.warnTimer = 0.55;
          sound.playFootstep(true);
        }
      } else if (fall.state === 'warning') {
        fall.warnTimer -= dt;
        if (fall.warnTimer <= 0) {
          fall.state = 'falling';
          fall.vy = 2;
        }
      } else if (fall.state === 'falling') {
        fall.vy += 18 * dt;
        fall.y += fall.vy * 60 * dt;

        // Check ground hit
        if (fall.y >= fall.targetY) {
          fall.y = fall.targetY;
          fall.state = 'broken';
          sound.playFootstep(true);
        }

        // Check if hitting characters
        const hazardBox = { x: fall.x, y: fall.y, width: fall.width, height: fall.height };
        if (this.rectIntersect(this.state.zeff, hazardBox)) {
          this.state.candle.stability = Math.max(0, this.state.candle.stability - 25);
          sound.playFlameFlicker();
          this.showNotification('CHANDELIER STRUCK ZEFF!');
          fall.state = 'broken';
        } else if (this.rectIntersect(this.state.noe, hazardBox)) {
          // NOE absorbs the blow with shield/coat
          sound.playWindBlock();
          this.showNotification('NOE DEFLECTED THE CEILING DEBRIS');
          fall.state = 'broken';
        }
      }
    }
  }

  private updateWindHazards(_dt: number) {
    let anyWindHittingZeff = false;
    let anyWindBlockedByNoe = false;
    let maxWindStrength = 0;

    for (const wind of this.state.windHazards) {
      if (!wind.active) continue;

      const zeffInWindZone =
        this.state.zeff.x >= wind.startX &&
        this.state.zeff.x <= wind.endX &&
        this.state.zeff.y >= wind.y &&
        this.state.zeff.y <= wind.y + wind.height + 40;

      if (zeffInWindZone) {
        maxWindStrength = Math.max(maxWindStrength, wind.strength);

        // Check if NOE is positioned to block the wind!
        // Wind direction: 'left' means wind travels from RIGHT to LEFT. Wind source is to the right!
        // Therefore, NOE must be to the RIGHT of ZEFF (noe.x > zeff.x) to block it.
        // Wind direction: 'right' means wind travels from LEFT to RIGHT. NOE must be to the LEFT of ZEFF.
        let isProtected = false;
        const dist = Math.abs(this.state.noe.x - this.state.zeff.x);
        const maxBlockDist = this.state.noe.isBracing ? 175 : 120;
        const yDiff = Math.abs(this.state.noe.y - this.state.zeff.y);

        if (wind.direction === 'left') {
          // Wind coming from right -> NOE must be in front of ZEFF (higher X)
          if (this.state.noe.x > this.state.zeff.x && dist < maxBlockDist && yDiff < 60) {
            isProtected = true;
          }
        } else {
          // Wind coming from left -> NOE must be behind ZEFF (lower X)
          if (this.state.noe.x < this.state.zeff.x && dist < maxBlockDist && yDiff < 60) {
            isProtected = true;
          }
        }

        if (isProtected) {
          anyWindBlockedByNoe = true;
        } else {
          anyWindHittingZeff = true;
        }
      }
    }

    this.state.candle.isExposedToWind = anyWindHittingZeff;
    this.state.candle.isProtectedByNoe = anyWindBlockedByNoe;

    // Update audio wind volume
    sound.updateWindIntensity(maxWindStrength);

    // Bend the flame
    if (anyWindHittingZeff) {
      // Wind pushes flame
      this.state.candle.flameAngle = -0.65;
    } else if (anyWindBlockedByNoe) {
      this.state.candle.flameAngle = -0.1;
    } else {
      this.state.candle.flameAngle = Math.sin(this.state.time * 4) * 0.05;
    }
  }

  private updateShadowMonsters(dt: number) {
    let shadowAttackingZeff = false;

    for (const monster of this.state.shadowMonsters) {
      if (monster.state === 'banished') continue;

      // 1. Check trigger
      if (monster.state === 'dormant') {
        if (this.state.noe.x >= monster.triggerX || this.state.zeff.x >= monster.triggerX) {
          monster.state = 'emerging';
          monster.animTimer = 0;
          sound.playMonsterEmerge();
          this.showNotification('SHADOW LURKER AWAKENS IN THE CORRIDOR!');
        }
      } else if (monster.state === 'emerging') {
        monster.animTimer += dt;
        if (monster.animTimer > 0.6) {
          monster.state = 'stalking';
        }
      } else if (monster.state === 'stalking') {
        // Stalk towards ZEFF (the flame bearer)
        const targetX = this.state.zeff.x;
        const dx = targetX - monster.x;
        const moveDir = dx > 0 ? 1 : -1;
        monster.vx = moveDir * monster.speed;
        monster.x += monster.vx * 60 * dt;

        // Check if NOE intercepts or wards off the monster
        const distToNoe = Math.abs(this.state.noe.x - monster.x);
        const noeBetween =
          (monster.x < this.state.noe.x && this.state.noe.x < this.state.zeff.x) ||
          (this.state.zeff.x < this.state.noe.x && this.state.noe.x < monster.x);

        // If NOE is close and between, or actively bracing towards monster
        if (distToNoe < 48 && (noeBetween || this.state.noe.isBracing)) {
          // NOE wards the monster!
          monster.state = 'retreating';
          monster.vx = -moveDir * 3.5;
          monster.health -= 1;
          sound.playWindBlock();
          this.showNotification('NOE WARDS OFF THE SHADOW CREATURE!');

          if (monster.health <= 0) {
            monster.state = 'banished';
            sound.playMonsterBanished();
            this.showNotification('THE SHADOW CREATURE DISSIPATED INTO MIST');
          }
        }

        // Check if monster reaches ZEFF
        const distToZeff = Math.abs(this.state.zeff.x - monster.x);
        if (distToZeff < 28 && monster.state === 'stalking') {
          shadowAttackingZeff = true;
          this.state.candle.stability = Math.max(0, this.state.candle.stability - 18 * dt);
          this.state.candle.flickerIntensity = 0.8;
          if (Math.random() < 0.2) {
            sound.playFlameFlicker();
          }
        }
      } else if (monster.state === 'retreating') {
        monster.x += monster.vx * 60 * dt;
        monster.vx *= 0.94;
        if (Math.abs(monster.vx) < 0.2) {
          monster.state = 'stalking';
        }
      }
    }

    this.state.candle.isUnderAttack = shadowAttackingZeff;
  }

  private updateCollectibles() {
    // Keys (Only ZEFF interacts with keys!)
    for (const key of this.state.collectibleKeys) {
      if (!key.collected) {
        const dist = Math.hypot(this.state.zeff.x - key.x, this.state.zeff.y - key.y);
        if (dist < 36) {
          key.collected = true;
          this.state.keysCollected.push(key.id);
          sound.playKeyCollect();
          this.showNotification(`ZEFF RETRIEVED: ${key.label.toUpperCase()}`);
        }
      }
    }

    // Wax Pickups (Both or Zeff can grab, restores candle)
    for (const wax of this.state.waxPickups) {
      if (!wax.collected) {
        const distZeff = Math.hypot(this.state.zeff.x - wax.x, this.state.zeff.y - wax.y);
        const distNoe = Math.hypot(this.state.noe.x - wax.x, this.state.noe.y - wax.y);
        if (distZeff < 32 || distNoe < 32) {
          wax.collected = true;
          this.state.candle.stability = Math.min(
            this.state.candle.maxStability,
            this.state.candle.stability + wax.amount
          );
          sound.playWaxPickup();
          this.showNotification(`SACRED WAX RESTORED FLAME (+${wax.amount}%)`);
        }
      }
    }
  }

  private updateCandle(dt: number) {
    const candle = this.state.candle;

    // Normal burn rate
    const normalBurnRate = 0.45; // ~3.5 minutes total life if unhurried, wax pickups replenish
    let currentDrain = normalBurnRate;

    if (candle.isExposedToWind) {
      const protectMultiplier = this.state.zeff.isProtecting ? 0.6 : 1.0;
      currentDrain += 15.0 * protectMultiplier;

      this.flickerSoundTimer += dt;
      if (this.flickerSoundTimer > 0.4) {
        sound.playFlameFlicker();
        this.flickerSoundTimer = 0;
      }
    }

    candle.stability = Math.max(0, candle.stability - currentDrain * dt);

    // Light radius dynamic response - brightened so corridor and obstacles are clearly visible
    const stabilityRatio = candle.stability / 100;
    const flickerJitter = Math.sin(this.state.time * 24) * (candle.isExposedToWind ? 18 : 6);
    
    let baseRadius = 260;
    let maxExtra = 160;
    if (this.state.brightnessMode === 'extra') {
      baseRadius = 320;
      maxExtra = 200;
    } else if (this.state.brightnessMode === 'classic') {
      baseRadius = 140;
      maxExtra = 130;
    }

    candle.lightRadius = Math.max(160, Math.floor(baseRadius + maxExtra * stabilityRatio + flickerJitter));
  }

  public cycleBrightness(): BrightnessMode {
    const modes: BrightnessMode[] = ['bright', 'extra', 'classic'];
    const currentIndex = modes.indexOf(this.state.brightnessMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.state.brightnessMode = nextMode;
    
    const label = nextMode === 'bright' ? 'TERANG (STANDAR)' : (nextMode === 'extra' ? 'EKSTRA TERANG' : 'KLASIK GOTIK');
    this.showNotification(`MODE KECERAHAN: ${label}`, 2.5);
    return nextMode;
  }

  public setBrightnessMode(mode: BrightnessMode) {
    this.state.brightnessMode = mode;
  }

  private updateCamera(_dt: number) {
    // Camera centers around the midpoint of both characters with gentle lead
    const midX = (this.state.noe.x + this.state.zeff.x) / 2;
    const targetCameraX = Math.max(0, midX - 380);
    this.state.cameraX += (targetCameraX - this.state.cameraX) * 0.08;
  }

  private updateSections(dt: number) {
    const midX = (this.state.noe.x + this.state.zeff.x) / 2;
    for (let i = SECTION_MARKERS.length - 1; i >= 0; i--) {
      if (midX >= SECTION_MARKERS[i].startX) {
        if (this.state.currentSection.id !== SECTION_MARKERS[i].id) {
          this.state.currentSection = SECTION_MARKERS[i];
          this.showNotification(`${SECTION_MARKERS[i].name}: ${SECTION_MARKERS[i].title.toUpperCase()}`);
        }
        break;
      }
    }

    if (this.state.notificationTimer > 0) {
      this.state.notificationTimer -= dt;
      if (this.state.notificationTimer <= 0) {
        this.state.notification = null;
      }
    }
  }

  public showNotification(text: string, duration = 3.5) {
    this.state.notification = text;
    this.state.notificationTimer = duration;
  }

  private checkWinLoss() {
    // 1. Candle Extinguished
    if (this.state.candle.stability <= 0) {
      this.state.gameState = 'gameover';
      sound.playExtinguish();
      return;
    }

    // 2. Falling into deep pits
    if (this.state.noe.y > 580 || this.state.zeff.y > 580) {
      this.state.candle.stability = 0;
      this.state.gameState = 'gameover';
      sound.playExtinguish();
      return;
    }

    // 3. Victory: Both reach the exit threshold at end of corridor (x > 7440)
    if (this.state.noe.x >= 7440 && this.state.zeff.x >= 7440) {
      this.state.gameState = 'victory';
      sound.playVictory();
    }
  }

  private rectIntersect(
    r1: { x: number; y: number; width: number; height: number },
    r2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }
}
