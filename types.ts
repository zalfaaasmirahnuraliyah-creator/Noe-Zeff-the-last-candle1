export interface Vector2D {
  x: number;
  y: number;
}

export type Direction = 'left' | 'right';

export interface CharacterState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: Direction;
  isMoving: boolean;
  isJumping: boolean;
  isBracing: boolean; // NOE shield/brace stance
  isProtecting: boolean; // ZEFF hunching over candle
  animTimer: number;
  animFrame: number;
}

export interface CandleState {
  stability: number; // 0 to 100
  maxStability: number;
  flickerIntensity: number;
  flameAngle: number; // in radians, bends with wind
  lightRadius: number;
  isUnderAttack: boolean;
  isExposedToWind: boolean;
  isProtectedByNoe: boolean;
}

export interface WindHazard {
  id: string;
  startX: number;
  endX: number;
  y: number;
  height: number;
  direction: Direction;
  strength: number; // 1 to 5
  active: boolean;
  pulseTimer: number;
  isSupernatural?: boolean;
}

export interface ShadowMonster {
  id: string;
  x: number;
  y: number;
  targetX: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  state: 'dormant' | 'emerging' | 'stalking' | 'retreating' | 'banished';
  animTimer: number;
  health: number;
  triggerX: number;
  speed: number;
}

export interface FallingHazard {
  id: string;
  x: number;
  y: number;
  targetY: number;
  width: number;
  height: number;
  state: 'hanging' | 'warning' | 'falling' | 'broken';
  warnTimer: number;
  vy: number;
  triggerX: number;
}

export interface PressurePlate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isPressed: boolean;
  connectedDoorId: string;
}

export interface GateDoor {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetHeight: number;
  currentHeight: number;
  isLocked: boolean;
  requiresKeyId?: string;
  isOpen: boolean;
}

export interface CollectibleKey {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  label: string;
}

export interface WaxPickup {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  amount: number;
}

export interface CollapsingFloor {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: 'stable' | 'shaking' | 'collapsed' | 'restoring';
  shakeTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'floor' | 'crate' | 'wall' | 'bridge';
}

export interface BackgroundElement {
  x: number;
  y: number;
  type: 'window' | 'curtain' | 'painting' | 'chandelier' | 'pillar' | 'grandfather_clock' | 'arch' | 'cobweb' | 'mirror';
  width: number;
  height: number;
  detail?: string;
}

export interface SectionMarker {
  id: number;
  name: string;
  startX: number;
  title: string;
  subtitle: string;
}

export type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export type BrightnessMode = 'bright' | 'extra' | 'classic';
