import React from 'react';
import { Loader2, Film, Layers, CheckCircle2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[#121821] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl animate-pulse space-y-6">
      {/* Status indicator checklist during analysis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
          <span className="text-sm font-semibold text-slate-200">
            Analyzing video stream & formats...
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-rose-400">
            <Film className="w-3.5 h-3.5 animate-pulse" />
            <span>Loading thumbnail...</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Loading metadata...</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Checking formats...</span>
          </span>
        </div>
      </div>

      {/* Main card skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Thumbnail skeleton */}
        <div className="lg:col-span-5 aspect-video w-full rounded-xl bg-slate-800/60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent animate-shimmer" />
        </div>

        {/* Video info skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-6 bg-slate-800/80 rounded-md w-3/4" />
          <div className="h-4 bg-slate-800/50 rounded-md w-1/2" />
          
          <div className="flex items-center gap-3 pt-2">
            <div className="h-4 bg-slate-800/60 rounded-md w-20" />
            <div className="h-4 bg-slate-800/60 rounded-md w-24" />
            <div className="h-4 bg-slate-800/60 rounded-md w-28" />
          </div>

          <div className="pt-4 border-t border-slate-800/60 space-y-2">
            <div className="h-4 bg-slate-800/40 rounded w-full" />
            <div className="h-4 bg-slate-800/40 rounded w-5/6" />
          </div>
        </div>
      </div>

      {/* Formats list skeleton */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-800/70 rounded w-36" />
          <div className="h-8 bg-slate-800/50 rounded-lg w-44" />
        </div>

        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 border border-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-slate-800/80 rounded" />
                <div className="w-24 h-4 bg-slate-800/60 rounded" />
                <div className="w-16 h-4 bg-slate-800/40 rounded hidden sm:block" />
              </div>
              <div className="w-24 h-9 bg-slate-800/80 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
