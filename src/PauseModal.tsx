import React from 'react';
import { Play, RotateCcw, Maximize2, Minimize2, Volume2, VolumeX, Shield, Flame, X, Sun } from 'lucide-react';
import { BrightnessMode } from '../types';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onToggleMute: () => void;
  isMuted: boolean;
  brightnessMode: BrightnessMode;
  onCycleBrightness: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onToggleFullscreen,
  isFullscreen,
  onToggleMute,
  isMuted,
  brightnessMode,
  onCycleBrightness,
}) => {
  const getBrightnessLabel = () => {
    switch (brightnessMode) {
      case 'extra':
        return 'EKSTRA CERAH';
      case 'classic':
        return 'KLASIK GOTIK';
      default:
        return 'TERANG (STANDAR)';
    }
  };
  return (
    <div
      id="pause-modal"
      className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-['Cinzel',serif] select-none"
    >
      <div className="max-w-xl w-full bg-neutral-950/95 border border-amber-900/40 rounded-sm p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-neutral-200 relative">
        {/* Close Button */}
        <button
          id="btn-close-pause"
          onClick={onResume}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 p-1 border border-neutral-800 rounded-sm transition-colors cursor-pointer"
          title="Resume (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-block text-[10px] font-['Silkscreen',sans-serif] tracking-widest text-amber-500 uppercase bg-amber-950/50 px-2.5 py-0.5 rounded border border-amber-800/40 mb-1">
            LAPTOP & PC EDITION • DIJEDA
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-amber-100 uppercase">
            Game Paused
          </h2>
          <p className="text-neutral-400 font-['Silkscreen',sans-serif] text-xs">
            Waktu terhenti di lorong mansion. Lilin menunggu.
          </p>
        </div>

        {/* Laptop Keyboard Controls Map */}
        <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-sm space-y-3 font-['Silkscreen',sans-serif]">
          <div className="text-[11px] text-amber-300 font-bold tracking-wider uppercase border-b border-neutral-800/80 pb-1.5 flex justify-between items-center">
            <span>PETA KONTROL KEYBOARD LAPTOP</span>
            <span className="text-[9px] text-neutral-400">1 KEYBOARD (2 PEMAIN / SOLO)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Player 1 / Left Hand: Noe */}
            <div className="bg-neutral-950/80 p-2.5 rounded border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-amber-200 font-bold mb-1.5 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>NOE (TANGAN KIRI)</span>
              </div>
              <ul className="space-y-1 text-[10px] text-neutral-300">
                <li className="flex justify-between">
                  <span className="text-neutral-400">Lompat / Jump:</span>
                  <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">W</kbd>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-400">Jalan Kiri / Kanan:</span>
                  <span className="space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">A</kbd>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">D</kbd>
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-400">Tahan Tameng / Block:</span>
                  <span className="space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">S</kbd>
                    <span className="text-neutral-500">/</span>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">Space</kbd>
                  </span>
                </li>
              </ul>
            </div>

            {/* Player 2 / Right Hand: Zeff */}
            <div className="bg-neutral-950/80 p-2.5 rounded border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-amber-200 font-bold mb-1.5 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>ZEFF (TANGAN KANAN)</span>
              </div>
              <ul className="space-y-1 text-[10px] text-neutral-300">
                <li className="flex justify-between">
                  <span className="text-neutral-400">Lompat / Jump:</span>
                  <span className="space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">▲</kbd>
                    <span className="text-neutral-500">/</span>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">I</kbd>
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-400">Jalan Kiri / Kanan:</span>
                  <span className="space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">◄</kbd>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">►</kbd>
                    <span className="text-neutral-500">/</span>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">J</kbd>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">L</kbd>
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-400">Lindungi Api / Kunci:</span>
                  <span className="space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">▼</kbd>
                    <span className="text-neutral-500">/</span>
                    <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-amber-300 rounded text-[10px]">K</kbd>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[10px] text-neutral-400">
            <span>Shortcut Cepat Laptop:</span>
            <div className="flex flex-wrap gap-2">
              <span><kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">B</kbd> Kecerahan</span>
              <span><kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">F</kbd> Fullscreen</span>
              <span><kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">M</kbd> Mute</span>
              <span><kbd className="px-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">Esc</kbd> Pause</span>
            </div>
          </div>
        </div>

        {/* Brightness Adjustment Bar */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 p-3 rounded-sm flex items-center justify-between font-['Silkscreen',sans-serif] text-xs">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-neutral-300 text-[11px]">KECERAHAN LAYAR:</span>
            <span className="text-amber-300 font-bold text-[11px]">{getBrightnessLabel()}</span>
          </div>
          <button
            id="btn-cycle-brightness-pause"
            onClick={onCycleBrightness}
            className="px-3 py-1 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-700/60 hover:border-amber-500 text-amber-200 text-[10px] rounded cursor-pointer transition-colors"
          >
            UBAH (B)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-['Silkscreen',sans-serif] text-xs">
          <button
            id="btn-resume-game"
            onClick={onResume}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-950/70 hover:bg-amber-900 border border-amber-600 hover:border-amber-400 text-amber-100 rounded-sm cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RESUME</span>
          </button>

          <button
            id="btn-toggle-fullscreen-pause"
            onClick={onToggleFullscreen}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 rounded-sm cursor-pointer transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'WINDOW' : 'FULLSCREEN'}</span>
          </button>

          <button
            id="btn-toggle-mute-pause"
            onClick={onToggleMute}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 rounded-sm cursor-pointer transition-all active:scale-95"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
          </button>

          <button
            id="btn-restart-game-pause"
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-800 text-neutral-300 hover:text-red-300 rounded-sm cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
