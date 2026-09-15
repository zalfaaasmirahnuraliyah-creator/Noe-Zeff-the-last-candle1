import React, { useRef, useEffect } from 'react';
import { GameEngine } from '../gameEngine';
import {
  drawNoe,
  drawZeff,
  drawShadowMonster,
  drawMansionWallBackground,
  drawWindow,
  drawWindParticles,
} from '../sprites';

interface GameCanvasProps {
  engine: GameEngine;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update engine
      engine.update(dt);

      const state = engine.state;
      const width = canvas.width;
      const height = canvas.height;
      const cameraX = Math.floor(state.cameraX);

      ctx.imageSmoothingEnabled = false;

      // 1. Draw Gothic Background
      drawMansionWallBackground(ctx, cameraX, width, height, state.time);

      // 2. Draw Background Decorative Objects (Windows, Clocks, Chandeliers)
      ctx.save();
      ctx.translate(-cameraX, 0);

      // Windows
      drawWindow(ctx, 1350, 140, true, state.candle.isExposedToWind || state.candle.isProtectedByNoe, state.time);
      drawWindow(ctx, 1600, 140, true, state.candle.isExposedToWind || state.candle.isProtectedByNoe, state.time);
      drawWindow(ctx, 3200, 140, false, false, state.time);
      drawWindow(ctx, 4650, 140, true, true, state.time);
      drawWindow(ctx, 5350, 140, true, true, state.time);
      drawWindow(ctx, 5850, 140, true, true, state.time);
      drawWindow(ctx, 6450, 140, true, true, state.time);

      // Grandfather Clocks
      [520, 3800].forEach((clockX) => {
        ctx.fillStyle = '#221811';
        ctx.fillRect(clockX, 480 - 95, 28, 95);
        ctx.fillStyle = '#422f21';
        ctx.strokeRect(clockX + 1, 480 - 94, 26, 93);
        // Clock face
        ctx.fillStyle = '#e5d9c5';
        ctx.beginPath();
        ctx.arc(clockX + 14, 480 - 75, 9, 0, Math.PI * 2);
        ctx.fill();
        // Pendulum
        const pendAngle = Math.sin(state.time * 2.5) * 0.3;
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(clockX + 14, 480 - 62);
        ctx.lineTo(clockX + 14 + Math.sin(pendAngle) * 20, 480 - 42);
        ctx.stroke();
      });

      // 3. Draw Platforms & Wooden Floorboards - brightened for player visibility
      for (const plat of state.platforms) {
        if (plat.type === 'floor') {
          // Floor base - rich warm chestnut
          ctx.fillStyle = '#3c291d';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Wood planks and nails
          const plankW = 32;
          const count = Math.ceil(plat.width / plankW);
          for (let p = 0; p < count; p++) {
            const px = plat.x + p * plankW;
            ctx.fillStyle = p % 2 === 0 ? '#4a3325' : '#432d20';
            ctx.fillRect(px, plat.y, Math.min(plankW - 1, plat.width - p * plankW), plat.height);

            // Floor surface highlight
            ctx.fillStyle = '#634533';
            ctx.fillRect(px, plat.y, Math.min(plankW - 1, plat.width - p * plankW), 2);

            // Planks nail dots
            ctx.fillStyle = '#221610';
            ctx.fillRect(px + 4, plat.y + 4, 1.5, 1.5);
            ctx.fillRect(px + plankW - 6, plat.y + 4, 1.5, 1.5);
          }
        } else if (plat.type === 'crate') {
          // Wooden crate - clear visibility
          ctx.fillStyle = '#65472b';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#3d2a17';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
          // Cross brace
          ctx.beginPath();
          ctx.moveTo(plat.x, plat.y);
          ctx.lineTo(plat.x + plat.width, plat.y + plat.height);
          ctx.moveTo(plat.x + plat.width, plat.y);
          ctx.lineTo(plat.x, plat.y + plat.height);
          ctx.stroke();
        } else if (plat.type === 'bridge') {
          // Balcony bridge
          ctx.fillStyle = '#4e3425';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#7a543e';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
        }
      }

      // Collapsing Floors
      for (const col of state.collapsingFloors) {
        if (col.state !== 'collapsed') {
          const shakeX = col.state === 'shaking' ? (Math.random() - 0.5) * 3 : 0;
          ctx.fillStyle = col.state === 'shaking' ? '#5a3b23' : '#4a301c';
          ctx.fillRect(col.x + shakeX, col.y, col.width, col.height);
          // Cracks
          ctx.strokeStyle = '#1b1008';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(col.x + 10 + shakeX, col.y);
          ctx.lineTo(col.x + 22 + shakeX, col.y + 25);
          ctx.lineTo(col.x + 36 + shakeX, col.y + 45);
          ctx.stroke();
        }
      }

      // Pressure Plates
      for (const plate of state.pressurePlates) {
        ctx.fillStyle = plate.isPressed ? '#1e252e' : '#313b48';
        const plateH = plate.isPressed ? 3 : 6;
        ctx.fillRect(plate.x, plate.y + (plate.isPressed ? 3 : 0), plate.width, plateH);
        ctx.fillStyle = '#c5a059';
        ctx.fillRect(plate.x + 12, plate.y + (plate.isPressed ? 3 : 0), plate.width - 24, 1.5);
      }

      // Gate Doors
      for (const door of state.gateDoors) {
        if (door.id === 'door-exit') {
          // Exit Door: Massive carved gothic double doors with radiant dawn light!
          ctx.fillStyle = '#1e140d';
          ctx.fillRect(door.x, door.y, door.width, door.height);
          ctx.strokeStyle = '#543b27';
          ctx.lineWidth = 2;
          ctx.strokeRect(door.x, door.y, door.width, door.height);

          // Iron door studs
          ctx.fillStyle = '#bda467';
          for (let i = 0; i < 4; i++) {
            ctx.fillRect(door.x + 8, door.y + 20 + i * 28, 3, 3);
            ctx.fillRect(door.x + door.width - 12, door.y + 20 + i * 28, 3, 3);
          }

          // Dawn light leaking beneath and around doors
          const dawnGlow = ctx.createLinearGradient(door.x - 40, 0, door.x + 60, 0);
          dawnGlow.addColorStop(0, 'rgba(255, 230, 170, 0)');
          dawnGlow.addColorStop(1, 'rgba(255, 235, 190, 0.45)');
          ctx.fillStyle = dawnGlow;
          ctx.fillRect(door.x - 40, door.y - 20, door.width + 50, door.height + 30);
        } else {
          // Iron portcullis or locked oak door
          if (door.isLocked) {
            // Locked Sanctum Door
            ctx.fillStyle = '#3a2318';
            ctx.fillRect(door.x, door.y, door.width, door.currentHeight);
            ctx.strokeStyle = '#1d110b';
            ctx.strokeRect(door.x, door.y, door.width, door.currentHeight);
            // Brass keyhole
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.arc(door.x + door.width / 2, door.y + door.currentHeight / 2 - 3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(door.x + door.width / 2 - 1.5, door.y + door.currentHeight / 2 - 1, 3, 5);
          } else {
            // Iron spiked portcullis
            ctx.fillStyle = '#1a1f26';
            const barCount = 4;
            const barW = 3;
            for (let b = 0; b < barCount; b++) {
              const bx = door.x + 3 + b * 5;
              ctx.fillRect(bx, door.y, barW, door.currentHeight);
              // Spikes
              ctx.beginPath();
              ctx.moveTo(bx, door.y + door.currentHeight);
              ctx.lineTo(bx + barW / 2, door.y + door.currentHeight + 6);
              ctx.lineTo(bx + barW, door.y + door.currentHeight);
              ctx.fill();
            }
          }
        }
      }

      // Collectible Brass Keys
      for (const key of state.collectibleKeys) {
        if (!key.collected) {
          const hoverY = key.y + Math.sin(state.time * 4) * 4;
          // Key ring
          ctx.strokeStyle = '#f1c40f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(key.x, hoverY, 5, 0, Math.PI * 2);
          ctx.stroke();
          // Key shaft & teeth
          ctx.fillStyle = '#f1c40f';
          ctx.fillRect(key.x + 4, hoverY - 1.5, 9, 3);
          ctx.fillRect(key.x + 9, hoverY + 1.5, 2, 3);
          ctx.fillRect(key.x + 12, hoverY + 1.5, 2, 4);

          // Golden sparkle
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(key.x - 2, hoverY - 6, 2, 2);
        }
      }

      // Sacred Wax Drops
      for (const wax of state.waxPickups) {
        if (!wax.collected) {
          const hover = Math.sin(state.time * 3 + wax.x) * 2;
          // Golden dish
          ctx.fillStyle = '#c5a059';
          ctx.fillRect(wax.x - 6, wax.y + 4 + hover, 12, 2);
          // Ivory wax pillar
          ctx.fillStyle = '#fdfbf7';
          ctx.fillRect(wax.x - 3, wax.y - 5 + hover, 6, 9);
          // Warm tiny flame
          ctx.fillStyle = '#ff9800';
          ctx.beginPath();
          ctx.arc(wax.x, wax.y - 7 + hover, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Falling Hazards (Chandeliers)
      for (const fall of state.fallingHazards) {
        if (fall.state === 'hanging' || fall.state === 'warning' || fall.state === 'falling') {
          const shake = fall.state === 'warning' ? (Math.random() - 0.5) * 4 : 0;
          const fx = fall.x + shake;
          const fy = fall.y;

          // Chain
          ctx.strokeStyle = '#2c3440';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(fx + fall.width / 2, 0);
          ctx.lineTo(fx + fall.width / 2, fy);
          ctx.stroke();

          // Chandelier body
          ctx.fillStyle = '#3a2b16';
          ctx.fillRect(fx + 6, fy + 12, fall.width - 12, 5);
          ctx.fillRect(fx + 14, fy + 4, fall.width - 28, 9);
          // Crystals
          ctx.fillStyle = '#9cb4c9';
          for (let c = 0; c < 5; c++) {
            ctx.fillRect(fx + 8 + c * 6, fy + 17, 3, 5);
          }
        } else if (fall.state === 'broken') {
          // Broken chandelier pieces on floor
          ctx.fillStyle = '#2c2214';
          ctx.fillRect(fall.x + 8, fall.targetY + 8, 14, 4);
          ctx.fillRect(fall.x + 24, fall.targetY + 10, 10, 3);
          ctx.fillStyle = '#7a92a8';
          ctx.fillRect(fall.x + 12, fall.targetY + 6, 3, 3);
          ctx.fillRect(fall.x + 28, fall.targetY + 7, 3, 2);
        }
      }

      // Wind Hazard Particles
      for (const wind of state.windHazards) {
        if (wind.active) {
          drawWindParticles(
            ctx,
            wind.startX,
            wind.endX,
            wind.y,
            wind.height,
            wind.direction,
            wind.strength,
            state.time
          );
        }
      }

      // Draw Shadow Monsters
      for (const monster of state.shadowMonsters) {
        drawShadowMonster(ctx, monster, state.time);
      }

      ctx.restore(); // end camera transform for world scenery

      // ==========================================
      // 4. DYNAMIC 2D LIGHTING & DARKNESS PASS (TRANSPARENT & SOFT)
      // ==========================================
      const zeffScreenX = Math.floor(state.zeff.x + 14 - cameraX);
      const zeffScreenY = Math.floor(state.zeff.y + 12);
      const lightRadius = state.candle.lightRadius;

      // Adapt darkness density according to user brightness mode
      let darknessAlpha = 0.32;
      let vignetteAlpha = 0.16;
      let noeRadius = 85;
      if (state.brightnessMode === 'extra') {
        darknessAlpha = 0.16;
        vignetteAlpha = 0.06;
        noeRadius = 120;
      } else if (state.brightnessMode === 'classic') {
        darknessAlpha = 0.68;
        vignetteAlpha = 0.40;
        noeRadius = 55;
      }

      // Prepare offscreen canvas buffer for darkness mask
      if (!lightCanvasRef.current) {
        lightCanvasRef.current = document.createElement('canvas');
      }
      const lightCanvas = lightCanvasRef.current;
      if (lightCanvas.width !== width || lightCanvas.height !== height) {
        lightCanvas.width = width;
        lightCanvas.height = height;
      }
      const lCtx = lightCanvas.getContext('2d');

      if (lCtx) {
        lCtx.clearRect(0, 0, width, height);

        // Fill background darkness veil
        lCtx.fillStyle = `rgba(10, 14, 22, ${darknessAlpha})`;
        lCtx.fillRect(0, 0, width, height);

        // Cut out light areas cleanly from darkness without affecting characters
        lCtx.globalCompositeOperation = 'destination-out';

        // Candle light cutout - soft, transparent radial gradient
        const lightGrad = lCtx.createRadialGradient(
          zeffScreenX,
          zeffScreenY,
          12,
          zeffScreenX,
          zeffScreenY,
          lightRadius
        );
        lightGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        lightGrad.addColorStop(0.60, 'rgba(0, 0, 0, 0.90)');
        lightGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.45)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = lightGrad;
        lCtx.beginPath();
        lCtx.arc(zeffScreenX, zeffScreenY, lightRadius, 0, Math.PI * 2);
        lCtx.fill();

        // Ambient halo around NOE
        const noeScreenX = Math.floor(state.noe.x + 13 - cameraX);
        const noeScreenY = Math.floor(state.noe.y + 24);
        const distNoeZeff = Math.hypot(noeScreenX - zeffScreenX, noeScreenY - zeffScreenY);

        if (distNoeZeff > lightRadius * 0.45) {
          const noeGrad = lCtx.createRadialGradient(
            noeScreenX,
            noeScreenY,
            6,
            noeScreenX,
            noeScreenY,
            noeRadius
          );
          noeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
          noeGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.40)');
          noeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = noeGrad;
          lCtx.beginPath();
          lCtx.arc(noeScreenX, noeScreenY, noeRadius, 0, Math.PI * 2);
          lCtx.fill();
        }

        // Cutout light for collectible brass keys
        for (const key of state.collectibleKeys) {
          if (!key.collected) {
            const kScreenX = Math.floor(key.x - cameraX);
            if (kScreenX > -50 && kScreenX < width + 50) {
              const kGrad = lCtx.createRadialGradient(kScreenX, key.y, 2, kScreenX, key.y, 55);
              kGrad.addColorStop(0, 'rgba(0, 0, 0, 0.80)');
              kGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              lCtx.fillStyle = kGrad;
              lCtx.beginPath();
              lCtx.arc(kScreenX, key.y, 55, 0, Math.PI * 2);
              lCtx.fill();
            }
          }
        }

        // Cutout light for sacred wax pickups
        for (const wax of state.waxPickups) {
          if (!wax.collected) {
            const wScreenX = Math.floor(wax.x - cameraX);
            if (wScreenX > -50 && wScreenX < width + 50) {
              const wGrad = lCtx.createRadialGradient(wScreenX, wax.y, 2, wScreenX, wax.y, 50);
              wGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
              wGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              lCtx.fillStyle = wGrad;
              lCtx.beginPath();
              lCtx.arc(wScreenX, wax.y, 50, 0, Math.PI * 2);
              lCtx.fill();
            }
          }
        }

        // Exit Door Dawn Light cutout
        const exitScreenX = Math.floor(7450 - cameraX);
        if (exitScreenX > -100 && exitScreenX < width + 100) {
          const exitGrad = lCtx.createRadialGradient(
            exitScreenX + 20,
            480 - 65,
            10,
            exitScreenX + 20,
            480 - 65,
            200
          );
          exitGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
          exitGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = exitGrad;
          lCtx.beginPath();
          lCtx.arc(exitScreenX + 20, 480 - 65, 200, 0, Math.PI * 2);
          lCtx.fill();
        }

        lCtx.globalCompositeOperation = 'source-over';

        // Draw the darkness mask onto the main canvas
        ctx.drawImage(lightCanvas, 0, 0);
      }

      // Very soft, transparent warm golden ambient radiance (low alpha, non-intrusive)
      const isDying = state.candle.stability < 25;
      const glowAlpha = state.candle.isExposedToWind ? 0.08 : (isDying ? 0.09 : 0.05);
      const warmGlow = ctx.createRadialGradient(
        zeffScreenX,
        zeffScreenY,
        8,
        zeffScreenX,
        zeffScreenY,
        lightRadius * 0.85
      );
      const glowRgb = state.candle.isExposedToWind
        ? '245, 124, 0'
        : (isDying ? '211, 47, 47' : '255, 195, 60');

      warmGlow.addColorStop(0, `rgba(${glowRgb}, ${glowAlpha})`);
      warmGlow.addColorStop(0.5, `rgba(${glowRgb}, ${glowAlpha * 0.4})`);
      warmGlow.addColorStop(1, `rgba(${glowRgb}, 0)`);
      ctx.fillStyle = warmGlow;
      ctx.beginPath();
      ctx.arc(zeffScreenX, zeffScreenY, lightRadius * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric subtle edge vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.42,
        width / 2,
        height / 2,
        width * 0.68
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, `rgba(0, 0, 0, ${vignetteAlpha})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // 5. FOREGROUND HERO LAYER - NOE & ZEFF (CRISP & CLEAR)
      // ==========================================
      ctx.save();
      ctx.translate(-cameraX, 0);

      // Render both characters in the foreground so they are completely unobstructed,
      // crystal clear, and never darkened or washed out by lighting passes
      drawNoe(ctx, state.noe, state.time);
      drawZeff(ctx, state.zeff, state.candle, state.time);

      // Wind-Blocking deflection barrier visual when NOE protects ZEFF!
      if (state.candle.isProtectedByNoe) {
        ctx.save();
        const shieldX = state.noe.x + (state.noe.facing === 'right' ? state.noe.width + 4 : -4);
        const shieldY = state.noe.y + 4;
        ctx.strokeStyle = 'rgba(235, 185, 60, 0.80)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(shieldX, shieldY + 20, 24, -Math.PI * 0.45, Math.PI * 0.45, state.noe.facing === 'left');
        ctx.stroke();

        // Flutter deflection sparkles
        ctx.fillStyle = '#fff3c4';
        for (let i = 0; i < 3; i++) {
          const spX = shieldX + (Math.sin(state.time * 20 + i) * 8);
          const spY = shieldY + 10 + ((state.time * 30 + i * 12) % 28);
          ctx.fillRect(spX, spY, 2, 2);
        }
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  return (
    <div id="game-canvas-container" className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        id="game-canvas"
        ref={canvasRef}
        width={960}
        height={540}
        className="w-full h-full object-contain aspect-video shadow-2xl rounded-xs border border-neutral-900/50"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};
