import React from 'react';
import { RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart }) => {
  return (
    <div
      id="game-over-modal"
      className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center font-['Cinzel',serif] z-50 animate-fade-in"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        {/* Extinguished Candle Icon / Smoke */}
        <div className="w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-950 text-neutral-600 mb-2">
          <span className="text-2xl opacity-40">🕯</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl tracking-widest text-neutral-300 font-bold uppercase">
            The Candle Went Out
          </h2>
          <p className="text-neutral-500 font-['Silkscreen',sans-serif] text-xs tracking-wider">
            Darkness claimed the corridor. The flame must never die.
          </p>
        </div>

        <div className="h-px w-24 bg-neutral-800 my-2" />

        <button
          id="btn-restart-game"
          onClick={onRestart}
          className="group flex items-center gap-2.5 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-700/80 rounded-sm text-neutral-200 hover:text-amber-200 transition-all font-['Silkscreen',sans-serif] text-xs tracking-widest cursor-pointer shadow-lg active:scale-95"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
          <span>REKINDLE & RESTART</span>
        </button>
      </div>
    </div>
  );
};
