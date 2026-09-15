import React from 'react';
import { Flame, Play } from 'lucide-react';

interface VictoryModalProps {
  onPlayAgain: () => void;
  candleStability: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ onPlayAgain, candleStability }) => {
  return (
    <div
      id="victory-modal"
      className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center font-['Cinzel',serif] z-50 animate-fade-in"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-6 border border-amber-900/40 bg-gradient-to-b from-amber-950/20 to-neutral-950 p-8 rounded-sm shadow-2xl">
        {/* Golden lit flame */}
        <div className="w-16 h-16 rounded-full border border-amber-600/60 flex items-center justify-center bg-amber-950/50 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
          <Flame className="w-8 h-8 animate-pulse text-amber-300" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl tracking-widest text-amber-200 font-bold uppercase">
            You Made It Out
          </h2>
          <p className="text-neutral-400 font-['Silkscreen',sans-serif] text-xs tracking-wider">
            Noe and Zeff emerged into the morning dawn. The flame endured.
          </p>
        </div>

        <div className="flex items-center gap-4 py-2 text-xs font-['Silkscreen',sans-serif] text-neutral-400">
          <div>
            <span className="text-neutral-500 block text-[10px]">FINAL FLAME</span>
            <span className="text-amber-300 text-sm font-bold">{Math.round(candleStability)}%</span>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div>
            <span className="text-neutral-500 block text-[10px]">STATUS</span>
            <span className="text-emerald-400 text-sm font-bold">ESCAPED</span>
          </div>
        </div>

        <div className="h-px w-32 bg-amber-900/40 my-1" />

        <button
          id="btn-play-again"
          onClick={onPlayAgain}
          className="group flex items-center gap-2.5 px-6 py-3 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-600/70 hover:border-amber-400 rounded-sm text-amber-100 transition-all font-['Silkscreen',sans-serif] text-xs tracking-widest cursor-pointer shadow-lg active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
