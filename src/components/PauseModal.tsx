import React from 'react';
import { PlayIcon, RestartIcon, ExitIcon } from './HeaderIcons';

interface PauseModalProps {
  realmName: string;
  turnText: string;
  capturedWhite: number;
  capturedBlack: number;
  onResume: () => void;
  onRestart: () => void;
  onChangeRealm: () => void;
  onExitToHome: () => void;
}

export function PauseModal({
  realmName,
  turnText,
  capturedWhite,
  capturedBlack,
  onResume,
  onRestart,
  onChangeRealm,
  onExitToHome
}: PauseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0d1017] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-[#f0ece1]">
        {/* Title */}
        <div className="text-center border-b border-white/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
            Active Session
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#f5d76e] mt-1">
            Game Paused
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your match state is auto-saved. Take your time or adjust the realm.
          </p>
        </div>

        {/* Current Match Briefing */}
        <div className="rounded-xl bg-[#141822] border border-white/10 p-4 flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>Environment:</span>
            <strong className="text-[#f5d76e] text-sm">{realmName}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Current Turn:</span>
            <span className="font-semibold text-white">{turnText || 'White to Move'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Pieces Captured:</span>
            <span className="text-slate-300">White: {capturedWhite} | Black: {capturedBlack}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-slate-950 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-all"
          >
            <PlayIcon className="w-4 h-4" />
            Resume Match
          </button>

          <button
            type="button"
            id="btn-reset"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors"
            title="Restart Match on the Altar"
          >
            <RestartIcon className="w-4 h-4 text-[#d4af37]" />
            Restart Match
          </button>

          <button
            type="button"
            onClick={onChangeRealm}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            Change Realm &amp; Armory
          </button>

          <button
            type="button"
            onClick={onExitToHome}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-200 hover:text-white flex items-center justify-center gap-2 transition-colors mt-1"
          >
            <ExitIcon className="w-4 h-4" />
            Exit to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
