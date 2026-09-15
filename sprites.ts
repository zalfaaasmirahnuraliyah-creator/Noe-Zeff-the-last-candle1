/**
 * Pixel-Art Rendering Engine.
 * Renders characters, gothic decorations, candle flame physics, and shadow creatures.
 */

import { CharacterState, CandleState, Direction, ShadowMonster } from './types';

// Helper to draw a pixel rect
export function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/**
 * Draw NOE - The Protector
 */
export function drawNoe(ctx: CanvasRenderingContext2D, noe: CharacterState, time: number) {
  ctx.save();
  const x = Math.floor(noe.x);
  const y = Math.floor(noe.y);
  const facing = noe.facing;
  const isMoving = noe.isMoving;
  const isGrounded = noe.isGrounded;
  const isBracing = noe.isBracing;
  const frame = Math.floor(noe.animFrame) % 4;

  // Flip horizontally if facing left
  if (facing === 'left') {
    ctx.translate(x + noe.width / 2, y + noe.height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + noe.width / 2), -(y + noe.height / 2));
  }

  // Bobbing offset
  const bob = isGrounded && isMoving ? (frame % 2 === 0 ? 1 : -1) : Math.sin(time * 3) * 0.8;

  // Palette - high-clarity adventurer tones
  const skin = '#e2c5b0';
  const hair = '#2b2320';
  const coatDark = '#25303d';
  const coatMid = '#38485c';
  const coatLight = '#536984';
  const belt = '#5c3d25';
  const buckle = '#d4be77';
  const boots = '#1a1d22';
  const eye = '#111';

  // 1. Billowing Mantle / Cloak (Back layer)
  const mantleFlutter = isBracing ? 8 : (isMoving ? Math.sin(time * 12) * 4 : Math.sin(time * 2) * 1.5);
  ctx.fillStyle = coatDark;
  if (isBracing) {
    // Broad defensive stance: Cloak flared out to block wind
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 14 + bob);
    ctx.lineTo(x + 28 + mantleFlutter, y + 44);
    ctx.lineTo(x - 6, y + 44);
    ctx.closePath();
    ctx.fill();
  } else {
    // Regular cloak
    ctx.fillRect(x + 4 - (facing === 'right' ? 3 : 0), y + 16 + bob, 14 + (isMoving ? 4 : 0), 24);
  }

  // 2. Legs / Boots
  ctx.fillStyle = boots;
  if (!isGrounded) {
    // Jump pose
    ctx.fillRect(x + 6, y + 36, 6, 8);
    ctx.fillRect(x + 14, y + 38, 6, 7);
  } else if (isMoving) {
    // Walking leg cycle
    const legOffset = frame === 0 ? -4 : frame === 1 ? 0 : frame === 2 ? 4 : 0;
    ctx.fillRect(x + 6 + legOffset, y + 36, 6, 12);
    ctx.fillRect(x + 14 - legOffset, y + 36, 6, 12);
  } else if (isBracing) {
    // Wide braced legs
    ctx.fillRect(x + 3, y + 38, 7, 10);
    ctx.fillRect(x + 16, y + 38, 8, 10);
  } else {
    // Idle stance
    ctx.fillRect(x + 6, y + 38, 6, 10);
    ctx.fillRect(x + 14, y + 38, 6, 10);
  }

  // 3. Torso & Heavy Coat
  ctx.fillStyle = coatMid;
  ctx.fillRect(x + 6, y + 14 + bob, 14, 22);

  // Coat trim / lapel
  ctx.fillStyle = coatLight;
  ctx.fillRect(x + 12, y + 14 + bob, 3, 20);

  // Belt
  ctx.fillStyle = belt;
  ctx.fillRect(x + 6, y + 26 + bob, 14, 3);
  ctx.fillStyle = buckle;
  ctx.fillRect(x + 12, y + 26 + bob, 3, 3);

  // 4. Arms & Shielding Stance
  ctx.fillStyle = coatDark;
  if (isBracing) {
    // Guarding arm raised forward like a heavy shield
    ctx.fillStyle = coatLight;
    ctx.fillRect(x + 16, y + 16 + bob, 8, 5);
    ctx.fillRect(x + 20, y + 14 + bob, 6, 12);
    // Leather gauntlet
    ctx.fillStyle = belt;
    ctx.fillRect(x + 22, y + 16 + bob, 4, 8);
  } else {
    // Arm swing
    const armSwing = isMoving ? Math.sin(time * 10) * 4 : 0;
    ctx.fillRect(x + 15 + armSwing, y + 16 + bob, 5, 14);
  }

  // 5. Head & High Collar
  // High coat collar
  ctx.fillStyle = coatMid;
  ctx.fillRect(x + 7, y + 11 + bob, 12, 5);

  // Face
  ctx.fillStyle = skin;
  ctx.fillRect(x + 9, y + 5 + bob, 9, 8);

  // Eye (determined gaze)
  ctx.fillStyle = eye;
  ctx.fillRect(x + 14, y + 8 + bob, 2, 2);

  // Hair
  ctx.fillStyle = hair;
  ctx.fillRect(x + 7, y + 2 + bob, 11, 4);
  ctx.fillRect(x + 6, y + 4 + bob, 4, 6);
  ctx.fillRect(x + 12, y + 3 + bob, 6, 3);

  // If bracing, show subtle golden warding particle rim
  if (isBracing) {
    ctx.strokeStyle = 'rgba(218, 165, 32, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 2, y + 8 + bob, noe.width + 12, noe.height - 4);
  }

  ctx.restore();
}

/**
 * Draw ZEFF - The Candle Carrier
 */
export function drawZeff(
  ctx: CanvasRenderingContext2D,
  zeff: CharacterState,
  candle: CandleState,
  time: number
) {
  ctx.save();
  const x = Math.floor(zeff.x);
  const y = Math.floor(zeff.y);
  const facing = zeff.facing;
  const isMoving = zeff.isMoving;
  const isGrounded = zeff.isGrounded;
  const isProtecting = zeff.isProtecting;
  const frame = Math.floor(zeff.animFrame) % 4;

  // Flip if facing left
  if (facing === 'left') {
    ctx.translate(x + zeff.width / 2, y + zeff.height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + zeff.width / 2), -(y + zeff.height / 2));
  }

  const bob = isGrounded && isMoving ? (frame % 2 === 0 ? 1 : -1) : Math.sin(time * 3.5) * 0.6;

  // Palette - warm crisp tones for visibility
  const skin = '#f5ddc9';
  const hair = '#5e4330';
  const tunic = '#78624a';
  const tunicTrim = '#9c8466';
  const pants = '#382f2a';
  const shoes = '#231d1b';
  const brass = '#dfa544';
  const candleWax = '#fff8eb';

  // 1. Legs
  ctx.fillStyle = pants;
  if (!isGrounded) {
    ctx.fillRect(x + 5, y + 26, 4, 6);
    ctx.fillRect(x + 11, y + 27, 4, 5);
  } else if (isMoving) {
    const legOffset = frame === 0 ? -3 : frame === 1 ? 0 : frame === 2 ? 3 : 0;
    ctx.fillRect(x + 4 + legOffset, y + 26, 4, 9);
    ctx.fillRect(x + 11 - legOffset, y + 26, 4, 9);
  } else {
    ctx.fillRect(x + 4, y + 26, 4, 9);
    ctx.fillRect(x + 11, y + 26, 4, 9);
  }
  ctx.fillStyle = shoes;
  ctx.fillRect(x + 3, y + 33, 5, 3);
  ctx.fillRect(x + 11, y + 33, 5, 3);

  // 2. Torso
  ctx.fillStyle = tunic;
  ctx.fillRect(x + 4, y + 12 + bob, 11, 15);
  ctx.fillStyle = tunicTrim;
  ctx.fillRect(x + 7, y + 12 + bob, 2, 14);

  // 3. Head
  ctx.fillStyle = skin;
  ctx.fillRect(x + 5, y + 4 + bob, 8, 8);

  // Hair
  ctx.fillStyle = hair;
  ctx.fillRect(x + 4, y + 2 + bob, 9, 3);
  ctx.fillRect(x + 3, y + 4 + bob, 3, 5);
  ctx.fillRect(x + 8, y + 2 + bob, 5, 2);

  // Nervous eye
  ctx.fillStyle = '#111';
  ctx.fillRect(x + 9, y + 7 + bob, 2, 2);

  // 4. Arms & Brass Candlestick
  const candleHandX = x + (isProtecting ? 11 : 14);
  const candleHandY = y + 16 + bob;

  // Arm holding candlestick
  ctx.fillStyle = tunic;
  ctx.fillRect(x + 9, y + 14 + bob, 5, 4);

  if (isProtecting) {
    // Cupping both hands over candle
    ctx.fillStyle = skin;
    ctx.fillRect(candleHandX - 2, candleHandY, 4, 4);
    ctx.fillRect(candleHandX + 4, candleHandY - 4, 3, 6);
  } else {
    ctx.fillStyle = skin;
    ctx.fillRect(candleHandX, candleHandY, 3, 3);
  }

  // Brass saucer and stem
  ctx.fillStyle = brass;
  ctx.fillRect(candleHandX - 1, candleHandY + 2, 8, 2); // Saucer
  ctx.fillRect(candleHandX + 2, candleHandY, 2, 3); // Stem
  ctx.fillRect(candleHandX - 2, candleHandY + 4, 10, 1); // Rim

  // Candle wax cylinder
  const waxHeight = Math.max(4, Math.floor((candle.stability / 100) * 8) + 2);
  ctx.fillStyle = candleWax;
  ctx.fillRect(candleHandX + 2, candleHandY - waxHeight, 3, waxHeight);

  // Candle wick
  ctx.fillStyle = '#222';
  ctx.fillRect(candleHandX + 3, candleHandY - waxHeight - 2, 1, 2);

  // 5. Dynamic Candle Flame
  drawCandleFlame(
    ctx,
    candleHandX + 3,
    candleHandY - waxHeight - 2,
    candle,
    time,
    facing
  );

  ctx.restore();
}

/**
 * Dynamic Candle Flame with bending wind physics, flicker, and embers
 */
export function drawCandleFlame(
  ctx: CanvasRenderingContext2D,
  flameBaseX: number,
  flameBaseY: number,
  candle: CandleState,
  time: number,
  _facing: Direction
) {
  if (candle.stability <= 0) return;

  const stabilityRatio = Math.max(0.1, candle.stability / 100);
  const flicker = (Math.sin(time * 25) * 0.3 + Math.cos(time * 37) * 0.4) * (candle.isExposedToWind ? 2.5 : 0.8);
  const flameH = Math.max(4, Math.floor(10 * stabilityRatio + flicker));
  const flameBend = candle.flameAngle * 12; // angle set by wind direction & intensity

  // Outer flame (warm amber/orange)
  const tipX = flameBaseX + flameBend + (Math.sin(time * 40) * 1.5);
  const tipY = flameBaseY - flameH;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(flameBaseX - 2.5, flameBaseY);
  ctx.quadraticCurveTo(flameBaseX - 3 + flameBend * 0.5, flameBaseY - flameH * 0.5, tipX, tipY);
  ctx.quadraticCurveTo(flameBaseX + 3 + flameBend * 0.5, flameBaseY - flameH * 0.5, flameBaseX + 2.5, flameBaseY);
  ctx.closePath();

  ctx.fillStyle = candle.isExposedToWind ? '#e65100' : (candle.stability < 30 ? '#ff5722' : '#ff9800');
  ctx.fill();

  // Inner flame (bright warm yellow/white core)
  const innerH = flameH * 0.55;
  const innerTipX = flameBaseX + flameBend * 0.7;
  const innerTipY = flameBaseY - innerH;

  ctx.beginPath();
  ctx.moveTo(flameBaseX - 1.5, flameBaseY);
  ctx.quadraticCurveTo(flameBaseX - 1.5, flameBaseY - innerH * 0.5, innerTipX, innerTipY);
  ctx.quadraticCurveTo(flameBaseX + 1.5, flameBaseY - innerH * 0.5, flameBaseX + 1.5, flameBaseY);
  ctx.closePath();
  ctx.fillStyle = '#fff9c4';
  ctx.fill();

  // Sparks / embers if flickering or exposed to wind
  if (candle.isExposedToWind || candle.stability < 40) {
    const sparkCount = candle.isExposedToWind ? 4 : 2;
    ctx.fillStyle = '#ffcc80';
    for (let i = 0; i < sparkCount; i++) {
      const spX = tipX + (Math.sin(time * 30 + i * 2) * 6) + (flameBend * 1.5);
      const spY = tipY - 3 - ((time * 40 + i * 8) % 14);
      ctx.fillRect(Math.floor(spX), Math.floor(spY), 1.5, 1.5);
    }
  }

  ctx.restore();
}

/**
 * Draw Shadow Monster
 */
export function drawShadowMonster(
  ctx: CanvasRenderingContext2D,
  monster: ShadowMonster,
  time: number
) {
  if (monster.state === 'banished' || monster.state === 'dormant') return;

  const x = Math.floor(monster.x);
  const y = Math.floor(monster.y);
  const w = monster.width;
  const h = monster.height;

  ctx.save();
  // Shadow body: billowing smoky mass with writhes
  const alpha = monster.state === 'emerging' ? Math.min(0.9, monster.animTimer / 0.5) : 0.88;
  ctx.fillStyle = `rgba(10, 10, 18, ${alpha})`;

  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Writhe tentacles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + time * 3;
    const wave = Math.sin(time * 8 + i) * 6;
    const tx = x + w / 2 + Math.cos(angle) * (w / 2 + 4 + wave);
    const ty = y + h / 2 + Math.sin(angle) * (h / 2 + 4 + wave);
    ctx.beginPath();
    ctx.arc(tx, ty, 3 + Math.sin(time * 5 + i) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Piercing glowing eyes
  const eyeColor = monster.state === 'retreating' ? '#90a4ae' : '#ff3344';
  ctx.fillStyle = eyeColor;
  const eyeOffset = Math.sin(time * 4) * 1.5;
  ctx.fillRect(x + w / 2 - 7, y + h / 2 - 3 + eyeOffset, 3, 3);
  ctx.fillRect(x + w / 2 + 4, y + h / 2 - 3 + eyeOffset, 3, 3);

  // Eye glow
  ctx.fillStyle = monster.state === 'retreating' ? 'rgba(144, 164, 174, 0.4)' : 'rgba(255, 51, 68, 0.35)';
  ctx.fillRect(x + w / 2 - 8, y + h / 2 - 4 + eyeOffset, 5, 5);
  ctx.fillRect(x + w / 2 + 3, y + h / 2 - 4 + eyeOffset, 5, 5);

  ctx.restore();
}

/**
 * Draw Gothic Background Details
 */
export function drawMansionWallBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  viewW: number,
  viewH: number,
  time: number
) {
  // Deep gothic atmospheric wall - brightened for player visibility
  ctx.fillStyle = '#1e2530';
  ctx.fillRect(0, 0, viewW, viewH);

  // Vertical wall panels and wainscoting
  const panelWidth = 140;
  const startPanel = Math.floor(cameraX / panelWidth);
  const endPanel = startPanel + Math.ceil(viewW / panelWidth) + 1;

  for (let i = startPanel; i <= endPanel; i++) {
    const screenX = i * panelWidth - cameraX;

    // Wood Pillar / Moldings - clarified
    ctx.fillStyle = '#2d3744';
    ctx.fillRect(screenX, 40, 12, viewH - 120);

    ctx.fillStyle = '#3c4959';
    ctx.fillRect(screenX + 2, 40, 2, viewH - 120);

    // Wallpaper damask motif inside panels
    ctx.fillStyle = '#252e3b';
    const centerX = screenX + panelWidth / 2;
    ctx.fillRect(centerX - 24, 120, 48, 80);
    ctx.strokeStyle = '#323e4f';
    ctx.lineWidth = 1;
    ctx.strokeRect(centerX - 24, 120, 48, 80);

    // Wainscoting base board
    ctx.fillStyle = '#2b3442';
    ctx.fillRect(screenX, viewH - 135, panelWidth, 25);
    ctx.fillStyle = '#3d4a5c';
    ctx.fillRect(screenX, viewH - 135, panelWidth, 2);
  }

  // Creepy portraits on walls
  for (let i = startPanel; i <= endPanel; i++) {
    if (i % 3 === 1) {
      const portraitX = i * panelWidth + 45 - cameraX;
      // Frame
      ctx.fillStyle = '#5c452b';
      ctx.fillRect(portraitX, 90, 40, 52);
      ctx.fillStyle = '#d4ae59';
      ctx.strokeRect(portraitX + 2, 92, 36, 48);

      // Painting canvas
      ctx.fillStyle = '#2a2822';
      ctx.fillRect(portraitX + 4, 94, 32, 44);

      // Mysterious silhouette in painting
      ctx.fillStyle = '#443c32';
      ctx.beginPath();
      ctx.arc(portraitX + 20, 108, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(portraitX + 13, 115, 14, 18);

      // Shifting eyes that subtly watch
      const eyeTrack = Math.sin(time * 0.6 + i) * 1.2;
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(portraitX + 18 + eyeTrack, 107, 1.5, 1.5);
      ctx.fillRect(portraitX + 22 + eyeTrack, 107, 1.5, 1.5);
    }
  }

  // Ceiling Vault Arch line
  ctx.fillStyle = '#151a22';
  ctx.fillRect(0, 0, viewW, 40);
  ctx.fillStyle = '#222b37';
  ctx.fillRect(0, 38, viewW, 2);
  ctx.fillStyle = '#161a22';
  ctx.fillRect(0, 39, viewW, 2);
}

/**
 * Draw Stained Glass Arched Window with Rain / Wind
 */
export function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  broken: boolean,
  windActive: boolean,
  time: number
) {
  ctx.save();
  // Window Frame
  ctx.fillStyle = '#28241f';
  ctx.fillRect(x, y, 64, 110);
  ctx.beginPath();
  ctx.arc(x + 32, y, 32, Math.PI, 0);
  ctx.fill();

  // Glass panes (midnight blue night storm outside)
  ctx.fillStyle = '#131b2c';
  ctx.fillRect(x + 6, y + 6, 52, 98);
  ctx.beginPath();
  ctx.arc(x + 32, y + 6, 26, Math.PI, 0);
  ctx.fill();

  // Rain streaks outside window
  ctx.strokeStyle = 'rgba(100, 140, 200, 0.25)';
  ctx.lineWidth = 1;
  for (let r = 0; r < 5; r++) {
    const rx = x + 10 + ((r * 11 + time * 40) % 44);
    const ry = y + 10 + ((r * 23 + time * 80) % 80);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 4, ry + 12);
    ctx.stroke();
  }

  // Broken glass jagged pattern
  if (broken) {
    ctx.strokeStyle = '#22304d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 50);
    ctx.lineTo(x + 30, y + 65);
    ctx.lineTo(x + 58, y + 40);
    ctx.moveTo(x + 30, y + 65);
    ctx.lineTo(x + 34, y + 104);
    ctx.stroke();

    // Broken hole
    ctx.fillStyle = '#090e18';
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 55);
    ctx.lineTo(x + 42, y + 50);
    ctx.lineTo(x + 38, y + 80);
    ctx.lineTo(x + 24, y + 75);
    ctx.closePath();
    ctx.fill();

    // Torn curtain billowing wildly if wind active
    const curtainWave = windActive ? Math.sin(time * 16) * 14 : Math.sin(time * 3) * 3;
    ctx.fillStyle = '#421a22'; // Dark velvet curtain
    ctx.beginPath();
    ctx.moveTo(x + 58, y + 8);
    ctx.quadraticCurveTo(x + 64 + curtainWave, y + 60, x + 50 + curtainWave * 1.5, y + 104);
    ctx.lineTo(x + 64, y + 104);
    ctx.lineTo(x + 64, y + 8);
    ctx.closePath();
    ctx.fill();
  } else {
    // Elegant gothic tracery cross
    ctx.fillStyle = '#28241f';
    ctx.fillRect(x + 30, y + 6, 4, 98);
    ctx.fillRect(x + 6, y + 50, 52, 4);
  }

  ctx.restore();
}

/**
 * Draw Wind Gust Particles
 */
export function drawWindParticles(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  y: number,
  h: number,
  dir: Direction,
  strength: number,
  time: number
) {
  ctx.save();
  const count = strength * 8;
  const length = Math.abs(endX - startX);
  const minX = Math.min(startX, endX);

  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const speed = (dir === 'left' ? -1 : 1) * (140 + (i % 4) * 50 * strength);
    const px = minX + ((seed + time * speed) % length + length) % length;
    const py = y + ((seed * 17.3 + Math.sin(time * 6 + i) * 12) % h + h) % h;

    // Streamline
    ctx.strokeStyle = `rgba(220, 235, 255, ${0.15 + (i % 3) * 0.08})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    const tail = dir === 'left' ? 18 : -18;
    ctx.lineTo(px + tail, py + Math.sin(time * 10 + i) * 2);
    ctx.stroke();

    // Floating dead leaf or torn parchment scrap
    if (i % 4 === 0) {
      ctx.fillStyle = i % 8 === 0 ? 'rgba(180, 150, 120, 0.6)' : 'rgba(150, 160, 170, 0.4)';
      ctx.fillRect(px, py, 2.5, 2.5);
    }
  }
  ctx.restore();
}
