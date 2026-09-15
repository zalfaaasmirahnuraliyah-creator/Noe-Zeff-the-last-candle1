/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './gameEngine';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { HelpModal } from './components/HelpModal';
import { PauseModal } from './components/PauseModal';
import { TouchControls } from './components/TouchControls';
import { BrightnessMode } from './types';
import { sound } from './audio';
import { Flame, Play, Shield, Laptop, Maximize2, Volume2, VolumeX, HelpCircle, Sun } from 'lucide-react';

export default function App() {
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }
  const engine = engineRef.current;

  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'victory'>('playing');
  const [candleStability, setCandleStability] = useState(100);
  const [brightnessMode, setBrightnessMode] = useState<BrightnessMode>(engine.state.brightnessMode);
  const [showHelp, setShowHelp] = useState(false);
  const [showTouch, setShowTouch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Listen for native fullscreen state changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    sound.ensureRunning();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const handlePause = useCallback(() => {
    if (!hasStarted) return;
    if (gameState === 'playing') {
      engine.state.gameState = 'paused';
      setGameState('paused');
    } else if (gameState === 'paused') {
      engine.state.gameState = 'playing';
      setGameState('playing');
    }
  }, [hasStarted, gameState, engine]);

  const handleRestart = useCallback(() => {
    engine.reset();
    setGameState('playing');
  }, [engine]);

  const handleCycleBrightness = useCallback(() => {
    const next = engine.cycleBrightness();
    setBrightnessMode(next);
  }, [engine]);

  // Poll state from engine for React UI synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      if (engine.state.gameState !== gameState && gameState !== 'paused') {
        setGameState(engine.state.gameState as 'playing' | 'paused' | 'gameover' | 'victory');
      }
      if (engine.state.brightnessMode !== brightnessMode) {
        setBrightnessMode(engine.state.brightnessMode);
      }
      setCandleStability(engine.state.candle.stability);
    }, 100);
    return () => clearInterval(interval);
  }, [engine, gameState, brightnessMode]);

  // Global Keyboard listener tailored for laptop ergonomics & hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scrolling with Space or Arrow keys during active gameplay
      if (
        ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) &&
        hasStarted &&
        gameState === 'playing'
      ) {
        e.preventDefault();
      }

      // Start game on any key press on title screen
      if (!hasStarted) {
        sound.init();
        sound.ensureRunning();
        setHasStarted(true);
        return;
      }

      // Laptop Hotkey: Brightness Toggle (B)
      if (e.code === 'KeyB' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleCycleBrightness();
        return;
      }

      // Laptop Hotkey: Fullscreen (F)
      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      // Laptop Hotkey: Mute Audio (M)
      if (e.code === 'KeyM' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      // Laptop Hotkey: Help (H)
      if (e.code === 'KeyH' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Laptop Hotkey: Pause / Resume (Escape or P)
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        handlePause();
        return;
      }

      // Restart hotkey on game over or victory
      if (e.code === 'KeyR' && (gameState === 'gameover' || gameState === 'victory')) {
        handleRestart();
        return;
      }

      if (gameState === 'playing') {
        engine.handleKeyDown(e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!hasStarted) return;
      engine.handleKeyUp(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hasStarted, gameState, engine, handlePause, handleRestart, handleToggleFullscreen, handleToggleMute, handleCycleBrightness]);

  const handleStartGame = () => {
    sound.init();
    sound.ensureRunning();
    setHasStarted(true);
  };

  return (
    <div
      id="game-root-viewport"
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-['Cinzel',serif] select-none"
    >
      {/* 1. Start Title Screen Overlay (Enhanced for Laptop & PC) */}
      {!hasStarted && (
        <div
          id="title-screen"
          onClick={handleStartGame}
          className="absolute inset-0 z-50 bg-neutral-950/95 flex flex-col items-center justify-center p-4 sm:p-6 text-center cursor-pointer select-none"
        >
          <div className="max-w-2xl w-full flex flex-col items-center gap-5">
            {/* Top Laptop Tag */}
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-950/50 border border-amber-800/40 rounded-full text-amber-300 text-[10px] sm:text-xs font-['Silkscreen',sans-serif] tracking-widest uppercase">
              <Laptop className="w-3.5 h-3.5" />
              <span>LAPTOP & PC EDITION • 1 KEYBOARD 2 PLAYERS / SOLO</span>
            </div>

            {/* Title Badge & Flickering Candle */}
            <div className="w-16 h-16 rounded-full border border-amber-800/60 bg-amber-950/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
              <Flame className="w-8 h-8 animate-pulse text-amber-300" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-amber-100 uppercase drop-shadow-md">
                Noe & Zeff
              </h1>
              <p className="text-amber-400 font-['Silkscreen',sans-serif] text-xs sm:text-sm tracking-widest uppercase">
                The Last Candle • Lilin Terakhir
              </p>
            </div>

            <p className="text-neutral-400 font-['Silkscreen',sans-serif] text-[11px] sm:text-xs max-w-lg leading-relaxed">
              Jelajahi lorong mansion gotik yang gelap gulita. Lindungi Zeff dan lilinnya dari hembusan angin jendela dan bayangan mengerikan.
            </p>

            {/* Laptop Keyboard Controls Diagram */}
            <div className="w-full max-w-xl bg-neutral-900/80 border border-neutral-800 rounded-sm p-4 text-left font-['Silkscreen',sans-serif] shadow-xl">
              <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider mb-2.5 flex justify-between items-center border-b border-neutral-800 pb-1.5">
                <span>KONTROL KEYBOARD LAPTOP:</span>
                <span className="text-neutral-400 text-[9px]">CO-OP 2 ORANG ATAU SOLO</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Noe / Left Hand */}
                <div className="bg-neutral-950/70 p-2.5 rounded border border-neutral-800/80">
                  <div className="flex items-center gap-1.5 text-amber-200 font-bold mb-1.5 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>NOE (PELINDUNG)</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Lompat:</span>
                      <kbd className="px-1.5 bg-neutral-800 text-amber-300 rounded border border-neutral-700">W</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Kiri / Kanan:</span>
                      <span className="space-x-1">
                        <kbd className="px-1.5 bg-neutral-800 text-amber-300 rounded border border-neutral-700">A</kbd>
                        <kbd className="px-1.5 bg-neutral-800 text-amber-300 rounded border border-neutral-700">D</kbd>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tameng / Block:</span>
                      <span className="space-x-1">
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">S</kbd>
                        <span className="text-neutral-500">/</span>
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">Space</kbd>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Zeff / Right Hand */}
                <div className="bg-neutral-950/70 p-2.5 rounded border border-neutral-800/80">
                  <div className="flex items-center gap-1.5 text-amber-200 font-bold mb-1.5 text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>ZEFF (PEMBAWA LILIN)</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Lompat:</span>
                      <span className="space-x-1">
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">▲</kbd>
                        <span className="text-neutral-500">/</span>
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">I</kbd>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kiri / Kanan:</span>
                      <span className="space-x-1">
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">◄ ►</kbd>
                        <span className="text-neutral-500">/</span>
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">J L</kbd>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lilin / Kunci:</span>
                      <span className="space-x-1">
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">▼</kbd>
                        <span className="text-neutral-500">/</span>
                        <kbd className="px-1 bg-neutral-800 text-amber-300 rounded border border-neutral-700">K</kbd>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[10px] text-neutral-400">
                <span>Tombol Pintas:</span>
                <div className="flex flex-wrap gap-2">
                  <span><kbd className="px-1 bg-neutral-800 rounded border border-neutral-700 text-neutral-300">B</kbd> Kecerahan</span>
                  <span><kbd className="px-1 bg-neutral-800 rounded border border-neutral-700 text-neutral-300">F</kbd> Layar Penuh</span>
                  <span><kbd className="px-1 bg-neutral-800 rounded border border-neutral-700 text-neutral-300">Esc / P</kbd> Jeda</span>
                  <span><kbd className="px-1 bg-neutral-800 rounded border border-neutral-700 text-neutral-300">M</kbd> Suara</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              id="btn-enter-mansion"
              onClick={handleStartGame}
              className="group flex items-center gap-2.5 px-8 py-3.5 bg-amber-950/70 hover:bg-amber-900 border border-amber-600 hover:border-amber-400 text-amber-100 rounded-sm text-xs tracking-widest font-['Silkscreen',sans-serif] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>MULAI PERMAINAN / START</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Game Canvas (Full 16:9 responsive laptop rendering) */}
      <GameCanvas engine={engine} />

      {/* 3. In-Game HUD with laptop hotkeys & status */}
      {hasStarted && gameState === 'playing' && (
        <GameHUD
          engine={engine}
          onToggleHelp={() => setShowHelp((prev) => !prev)}
          showHelp={showHelp}
          onToggleTouch={() => setShowTouch((prev) => !prev)}
          showTouch={showTouch}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          onPause={handlePause}
        />
      )}

      {/* 4. Optional Touch Controls (for 2-in-1 laptops or touchscreen tablets) */}
      {hasStarted && showTouch && gameState === 'playing' && (
        <TouchControls engine={engine} />
      )}

      {/* 5. Laptop Pause Modal (Esc or P) */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handlePause}
          onRestart={handleRestart}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          brightnessMode={brightnessMode}
          onCycleBrightness={handleCycleBrightness}
        />
      )}

      {/* 6. Game Over Modal */}
      {gameState === 'gameover' && <GameOverModal onRestart={handleRestart} />}

      {/* 7. Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal onPlayAgain={handleRestart} candleStability={candleStability} />
      )}

      {/* 8. Help & Mechanics Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
