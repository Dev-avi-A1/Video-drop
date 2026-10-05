import React, { useState } from 'react';
import { Eye, Calendar, User, ExternalLink, RotateCcw, Info, Share2, Check, Copy } from 'lucide-react';
import { VideoMetadata, VideoFormat } from '../types/index.js';
import { VideoThumbnail } from './VideoThumbnail.js';
import { FormatSelector } from './FormatSelector.js';
import { ShareModal } from './ShareModal.js';
import { formatViews, formatDate } from '../utils/formatters.js';

interface VideoResultProps {
  video: VideoMetadata;
  formats: VideoFormat[];
  isMock: boolean;
  providerNotice: string | null;
  onSelectFormat: (format: VideoFormat) => void;
  onReset: () => void;
  isDownloading: boolean;
}

export const VideoResult: React.FC<VideoResultProps> = ({
  video,
  formats,
  isMock,
  providerNotice,
  onSelectFormat,
  onReset,
  isDownloading
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);

  // Quick clipboard copy for the unique video link
  const handleQuickCopy = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const uniqueShareUrl = `${origin}${pathname}?v=${video.id}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(uniqueShareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = uniqueShareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="w-full bg-[#121821] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Banner if mock provider is active */}
      {isMock && (
        <div className="flex items-start gap-2.5 px-4 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-300 text-xs leading-relaxed">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Development Mock Provider: </span>
            {providerNotice || 'Simulated media format manifests for development testing without live API keys.'}
          </div>
        </div>
      )}

      {/* Main Video Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Thumbnail & Duration */}
        <div className="lg:col-span-5 w-full">
          <VideoThumbnail
            thumbnail={video.thumbnail}
            title={video.title}
            duration={video.duration}
          />
        </div>

        {/* Right: Metadata Details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {video.title}
              </h2>

              {/* Share button button trigger in header */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                title="Share this video link"
                className="shrink-0 p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Share video"
              >
                <Share2 className="w-4 h-4 text-rose-400" />
              </button>
            </div>

            {/* Channel and clean unboxed metadata with separators */}
            <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <User className="w-3.5 h-3.5 text-rose-400" />
                {video.channel}
              </span>

              {video.viewCount !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{formatViews(video.viewCount)}</span>
                  </span>
                </>
              )}

              {video.uploadDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(video.uploadDate)}</span>
                  </span>
                </>
              )}
            </div>

            {video.description && (
              <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            )}
          </div>

          {/* Action Row: Watch link, Share Link, Quick Copy, and Reset */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Quick Copy Link action */}
              <button
                type="button"
                onClick={handleQuickCopy}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {quickCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>

              {/* Open full share modal */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share...</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analyze another link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available formats section */}
      <div className="pt-6 border-t border-slate-800/80">
        <FormatSelector
          formats={formats}
          onSelectFormat={onSelectFormat}
          isDownloading={isDownloading}
        />
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        video={video}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
