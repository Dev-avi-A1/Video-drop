import React, { useState } from 'react';
import { Video, Music, Download } from 'lucide-react';
import { VideoFormat, FormatType } from '../types/index.js';

interface FormatSelectorProps {
  formats: VideoFormat[];
  onSelectFormat: (format: VideoFormat) => void;
  isDownloading: boolean;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  formats,
  onSelectFormat,
  isDownloading
}) => {
  const [activeTab, setActiveTab] = useState<FormatType>('video');

  const videoFormats = formats.filter((f) => f.type === 'video');
  const audioFormats = formats.filter((f) => f.type === 'audio');

  const displayedFormats = activeTab === 'video' ? videoFormats : audioFormats;

  return (
    <div className="w-full space-y-4">
      {/* Category Tabs: Video vs Audio */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video (MP4)</span>
            <span className="text-[10px] opacity-75 font-mono">({videoFormats.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio (MP3)</span>
            <span className="text-[10px] opacity-75 font-mono">({audioFormats.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline text-xs text-slate-400">
          Requested output quality
        </span>
      </div>

      {/* Formats Table / List */}
      <div className="space-y-2">
        {displayedFormats.map((format) => (
          <div
            key={format.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all duration-150 bg-[#161D27] hover:bg-[#1a2330] border-slate-800/80 hover:border-slate-700"
          >
            {/* Format specs */}
            <div className="flex items-center gap-3.5 mb-2 sm:mb-0">
              <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-slate-800 text-rose-400 border border-slate-700/60 shrink-0">
                {format.container}
              </span>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {format.quality}
                  </span>
                  {format.fps && (
                    <span className="text-xs text-slate-400 font-mono">
                      {format.fps} FPS
                    </span>
                  )}
                  {format.codec && (
                    <span className="hidden md:inline text-xs text-slate-500 font-mono">
                      · {format.codec}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                  {format.resolution && <span>{format.resolution}</span>}
                  {format.resolution && <span aria-hidden="true">·</span>}
                  <span>{format.estimatedSize}</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectFormat(format)}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-rose-600 active:bg-rose-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 hover:border-rose-500 transition-all flex items-center justify-center gap-1.5 shadow-sm group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download</span>
                </button>
            </div>
          </div>
        ))}

        {displayedFormats.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No formats found for this category.
          </div>
        )}
      </div>
    </div>
  );
};
