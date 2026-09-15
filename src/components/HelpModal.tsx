import React from 'react';
import { X, Shield, Flame, Wind, Ghost } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div
      id="help-modal"
      className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-['Silkscreen',sans-serif]"
    >
      <div className="max-w-lg w-full bg-neutral-950 border border-neutral-800 p-6 rounded-sm text-neutral-200 text-xs shadow-2xl relative">
        <button
          id="btn-close-help"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 p-1 border border-neutral-800 rounded-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold tracking-widest text-amber-300 uppercase mb-4 flex items-center gap-2">
          <span>COOPERATIVE GUIDE</span>
        </h3>

        <div className="space-y-4">
          {/* Characters */}
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-900">
            <div className="bg-neutral-900/60 p-3 rounded-xs border border-neutral-800/80">
              <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>NOE (TANGAN KIRI)</span>
              </div>
              <div className="text-neutral-400 text-[10px] mb-2 leading-relaxed">
                Sang Pelindung. Membuka jalan & memblokir hembusan angin/monster.
              </div>
              <div className="text-[10px] text-neutral-300 font-mono space-y-0.5">
                <div><span className="text-amber-400 font-bold">W</span> Lompat / Jump</div>
                <div><span className="text-amber-400 font-bold">A / D</span> Lari Kiri / Kanan</div>
                <div><span className="text-amber-400 font-bold">S / Spasi</span> Tahan Tameng (Brace)</div>
              </div>
            </div>

            <div className="bg-neutral-900/60 p-3 rounded-xs border border-neutral-800/80">
              <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>ZEFF (TANGAN KANAN)</span>
              </div>
              <div className="text-neutral-400 text-[10px] mb-2 leading-relaxed">
                Pembawa Lilin. Menjaga nyala api & mengambil kunci pintu gerbang.
              </div>
              <div className="text-[10px] text-neutral-300 font-mono space-y-0.5">
                <div><span className="text-amber-400 font-bold">▲ / I</span> Lompat / Jump</div>
                <div><span className="text-amber-400 font-bold">◄ ► / J L</span> Jalan Kiri / Kanan</div>
                <div><span className="text-amber-400 font-bold">▼ / K</span> Tutup Lilin / Ambil Kunci</div>
              </div>
            </div>
          </div>

          {/* Laptop Shortcuts Bar */}
          <div className="p-2.5 bg-neutral-900/40 rounded border border-neutral-800/60 flex flex-wrap items-center justify-between gap-1 text-[10px] text-neutral-400">
            <span className="text-amber-400/90 font-bold">SHORTCUT LAPTOP:</span>
            <span><kbd className="px-1 bg-neutral-800 text-neutral-200 rounded">B</kbd> Kecerahan</span>
            <span><kbd className="px-1 bg-neutral-800 text-neutral-200 rounded">F</kbd> Layar Penuh</span>
            <span><kbd className="px-1 bg-neutral-800 text-neutral-200 rounded">Esc / P</kbd> Jeda</span>
            <span><kbd className="px-1 bg-neutral-800 text-neutral-200 rounded">M</kbd> Suara</span>
            <span><kbd className="px-1 bg-neutral-800 text-neutral-200 rounded">R</kbd> Restart</span>
          </div>

          {/* Key Mechanics */}
          <div className="space-y-2 text-[11px] text-neutral-300">
            <div className="flex items-start gap-2.5">
              <Wind className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">Wind Shielding:</strong> When wind blows from broken windows, place NOE between the wind source and ZEFF. NOE's silhouette blocks the draft!
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Ghost className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">Shadow Lurkers:</strong> Shadow monsters seek the flame. Move NOE to intercept them or brace shield to banish them before they extinguish Zeff.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-100">Sacred Wax:</strong> Collect golden wax saucers in alcoves to replenish the candle. If the flame dies, the corridor is lost!
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs tracking-wider rounded-sm cursor-pointer"
          >
            RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  );
};
