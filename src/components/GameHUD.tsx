import React, { useState, useEffect } from 'react';
import { GameEngine } from '../gameEngine';
import { Volume2, VolumeX, Shield, Flame, Key, HelpCircle, Maximize2, Minimize2, Pause, Sun } from 'lucide-react';
import { sound } from '../audio';

interface GameHUDProps {
  engine: GameEngine;
  onToggleHelp: () => void;
  showHelp: boolean;
  onToggleTouch: () => void;
  showTouch: boolean;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  engine,
  onToggleHelp,
  showHelp,
  onToggleTouch,
  showTouch,
  onToggleFullscreen,
  isFullscreen,
  onPause,
}) => {
  const [, setTick] = useState(0);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const state = engine.state;
  const candle = state.candle;
  const stability = Math.max(0, Math.round(candle.stability));

  const handleMuteClick = () => {
    sound.ensureRunning();
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const hasKey = state.keysCollected.length > 0;

  return (
    <div id="game-hud-overlay" className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between font-['Silkscreen',sans-serif]">
      {/* Top Header Bar */}
      <div id="hud-top-bar" className="w-full flex items-start justify-between">
        {/* Top-Left: NOE */}
        <div
          id="hud-noe-card"
          className="pointer-events-auto flex items-center gap-2 bg-neutral-950/80 backdrop-blur-xs border border-neutral-800/80 px-3 py-2 rounded-sm text-neutral-300 shadow-lg text-xs"
        >
          <div className={`p-1 rounded ${state.noe.isBracing ? 'bg-amber-900/60 text-amber-300' : 'bg-neutral-800 text-neutral-400'}`}>
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-neutral-100">NOE</span>
              <span className="text-[10px] text-neutral-400 tracking-normal">[WASD]</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              {state.noe.isBracing ? (
                <span className="text-amber-400">BRACING SHIELD</span>
              ) : candle.isProtectedByNoe ? (
                <span className="text-emerald-400">BLOCKING WIND</span>
              ) : (
                'PROTECTOR'
              )}
            </div>
          </div>
        </div>

        {/* Top-Center: Candle Flame Indicator */}
        <div
          id="hud-candle-indicator"
          className="flex flex-col items-center gap-1 bg-neutral-950/85 backdrop-blur-xs border border-neutral-800/80 px-4 py-2 rounded-sm shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Flame
              className={`w-4 h-4 ${
                candle.isExposedToWind
                  ? 'text-red-500 animate-pulse'
                  : stability < 30
                  ? 'text-orange-500 animate-ping'
                  : 'text-amber-400'
              }`}
            />
            <span className="text-xs tracking-widest text-neutral-200">CANDLE</span>
            <span
              className={`text-xs font-mono font-bold ${
                stability < 30 ? 'text-red-400' : 'text-amber-300'
              }`}
            >
              {stability}%
            </span>
          </div>

          {/* Minimal Stability Bar */}
          <div className="w-32 sm:w-44 h-1.5 bg-neutral-900 rounded-xs overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-150 ${
                candle.isExposedToWind
                  ? 'bg-red-500'
                  : stability < 30
                  ? 'bg-orange-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${stability}%` }}
            />
          </div>

          {/* Contextual Warning */}
          {candle.isExposedToWind && (
            <span className="text-[10px] text-red-400 tracking-wider animate-bounce">
              WIND GUST! NOE BLOCK
            </span>
          )}
          {candle.isUnderAttack && (
            <span className="text-[10px] text-red-500 tracking-wider animate-pulse">
              SHADOW NEAR! WARD OFF
            </span>
          )}
          {candle.isProtectedByNoe && (
            <span className="text-[10px] text-emerald-400 tracking-wider">
              WIND BLOCKED BY NOE
            </span>
          )}
        </div>

        {/* Top-Right: ZEFF */}
        <div
          id="hud-zeff-card"
          className="pointer-events-auto flex items-center gap-2 bg-neutral-950/80 backdrop-blur-xs border border-neutral-800/80 px-3 py-2 rounded-sm text-neutral-300 shadow-lg text-xs"
        >
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-[10px] text-neutral-400 tracking-normal">[ARROWS]</span>
              <span className="font-bold tracking-wider text-neutral-100">ZEFF</span>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center justify-end gap-1">
              {hasKey && <Key className="w-3 h-3 text-amber-400 inline" />}
              {state.zeff.isProtecting ? (
                <span className="text-amber-300">CUPPING FLAME</span>
              ) : (
                'CARRIER'
              )}
            </div>
          </div>
          <div className="p-1 rounded bg-amber-950/60 text-amber-300">
            <Flame className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Center Cinematic Notification */}
      {state.notification && (
        <div
          id="hud-notification-banner"
          className="self-center py-1.5 px-4 bg-neutral-950/80 border border-neutral-800/80 rounded-sm text-neutral-200 text-xs tracking-wider text-center shadow-2xl animate-fade-in"
        >
          {state.notification}
        </div>
      )}

      {/* Bottom Bar: Section Info, Laptop Hotkeys & Action Buttons */}
      <div id="hud-bottom-bar" className="w-full flex items-end justify-between gap-3">
        {/* Section Indicator */}
        <div
          id="hud-section-badge"
          className="text-[10px] text-neutral-400 bg-neutral-950/80 border border-neutral-800/80 px-2.5 py-1.5 rounded-sm tracking-wide shrink-0"
        >
          <span className="text-neutral-500 mr-1.5">{state.currentSection.name}:</span>
          <span className="text-neutral-200">{state.currentSection.title}</span>
        </div>

        {/* Laptop Ergonomic Control Quick Bar (Center) */}
        <div
          id="hud-laptop-hints"
          className="hidden md:flex items-center gap-3 bg-neutral-950/85 border border-neutral-800/80 px-3.5 py-1 rounded-sm text-[10px] text-neutral-300 shadow-md backdrop-blur-xs select-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">NOE:</span>
            <span className="text-neutral-400">[WASD]</span>
          </div>
          <span className="text-neutral-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">ZEFF:</span>
            <span className="text-neutral-400">[▲◄▼► / IJKL]</span>
          </div>
          <span className="text-neutral-700">•</span>
          <div className="flex items-center gap-1 text-neutral-400">
            <kbd className="px-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-[9px]">B</kbd>
            <span>Cerah</span>
          </div>
          <span className="text-neutral-700">•</span>
          <div className="flex items-center gap-1 text-neutral-400">
            <kbd className="px-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-[9px]">F</kbd>
            <span>Layar Penuh</span>
          </div>
          <span className="text-neutral-700">•</span>
          <div className="flex items-center gap-1 text-neutral-400">
            <kbd className="px-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-[9px]">Esc</kbd>
            <span>Jeda</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="hud-actions" className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-hud-brightness"
            onClick={() => engine.cycleBrightness()}
            title="Ubah Kecerahan Layar (B)"
            className="p-1.5 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-amber-300 hover:text-amber-200 rounded-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-[9px]">
              {state.brightnessMode === 'extra' ? 'EKSTRA' : (state.brightnessMode === 'classic' ? 'GOTHIC' : 'CERAH')}
            </span>
          </button>

          <button
            id="btn-hud-pause"
            onClick={onPause}
            title="Pause Game (Esc / P)"
            className="p-1.5 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 rounded-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[9px]">JEDA</span>
          </button>

          <button
            id="btn-toggle-fullscreen"
            onClick={onToggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-1.5 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 rounded-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[9px]">{isFullscreen ? 'WINDOW' : 'FULL'}</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={handleMuteClick}
            title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
            className="p-1.5 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-sm transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-toggle-help"
            onClick={onToggleHelp}
            title="Panduan & Kontrol (H)"
            className={`p-1.5 border rounded-sm transition-colors cursor-pointer ${
              showHelp
                ? 'bg-neutral-800 border-neutral-600 text-neutral-100'
                : 'bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-toggle-touch"
            onClick={onToggleTouch}
            title="Toggle Layar Sentuh"
            className={`px-2 py-1.5 text-[9px] border rounded-sm transition-colors cursor-pointer ${
              showTouch
                ? 'bg-amber-950/70 border-amber-800 text-amber-200'
                : 'bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            TOUCH
          </button>
        </div>
      </div>
    </div>
  );
};
