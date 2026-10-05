import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animated = true }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-slate-400">Progress</span>
        <span className="text-rose-400 font-bold tabular-nums">{clampedProgress}%</span>
      </div>

      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 ${
            animated && clampedProgress < 100 ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
