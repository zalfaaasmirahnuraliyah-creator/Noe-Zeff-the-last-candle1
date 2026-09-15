import React from 'react';
import { GameEngine } from '../gameEngine';
import { Shield, ArrowUp, ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';

interface TouchControlsProps {
  engine: GameEngine;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine }) => {
  const triggerKey = (code: string, pressed: boolean) => {
    if (pressed) {
      engine.handleKeyDown(code);
    } else {
      engine.handleKeyUp(code);
    }
  };

  const bindTouch = (code: string) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      triggerKey(code, true);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      triggerKey(code, false);
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      triggerKey(code, true);
    },
    onMouseUp: (e: React.MouseEvent) => {
      e.preventDefault();
      triggerKey(code, false);
    },
    onMouseLeave: () => {
      triggerKey(code, false);
    },
  });

  return (
    <div
      id="touch-controls-container"
      className="absolute bottom-4 inset-x-4 pointer-events-none flex justify-between items-end select-none font-['Silkscreen',sans-serif] z-40"
    >
      {/* NOE Touch Cluster (Left) */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-neutral-950/70 p-2 border border-neutral-800 rounded-sm backdrop-blur-xs">
        <span className="text-[9px] text-neutral-400">NOE CONTROLS</span>
        <div className="grid grid-cols-3 gap-1.5">
          <div />
          <button
            id="touch-noe-w"
            {...bindTouch('KeyW')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            W
          </button>
          <div />

          <button
            id="touch-noe-a"
            {...bindTouch('KeyA')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            A
          </button>
          <button
            id="touch-noe-s"
            {...bindTouch('KeyS')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-amber-300 text-xs font-bold"
            title="Brace Shield"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            id="touch-noe-d"
            {...bindTouch('KeyD')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            D
          </button>
        </div>
      </div>

      {/* ZEFF Touch Cluster (Right) */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-neutral-950/70 p-2 border border-neutral-800 rounded-sm backdrop-blur-xs">
        <span className="text-[9px] text-neutral-400">ZEFF CONTROLS</span>
        <div className="grid grid-cols-3 gap-1.5">
          <div />
          <button
            id="touch-zeff-up"
            {...bindTouch('ArrowUp')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />

          <button
            id="touch-zeff-left"
            {...bindTouch('ArrowLeft')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="touch-zeff-down"
            {...bindTouch('ArrowDown')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-amber-300 text-xs font-bold"
            title="Protect Candle / Pick Key"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            id="touch-zeff-right"
            {...bindTouch('ArrowRight')}
            className="w-11 h-11 bg-neutral-900/90 active:bg-amber-900/80 border border-neutral-700 rounded-sm flex items-center justify-center text-neutral-200 text-xs font-bold"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
