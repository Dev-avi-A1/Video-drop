import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, ExternalLink } from 'lucide-react';
import { VideoMetadata } from '../types/index.js';
import { useDialog } from '../hooks/useDialog.js';

interface ShareModalProps {
  video: VideoMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const dialogRef = useDialog(isOpen, onClose);

  if (!isOpen) return null;

  // Generate unique URL for this specific analyzed video
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const uniqueShareUrl = `${origin}${pathname}?v=${video.id}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(uniqueShareUrl);
      } else {
        // Fallback for older browsers / iframe restrictions
        const textArea = document.createElement('textarea');
        textArea.value = uniqueShareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `VideoDrop: ${video.title}`,
          text: `Download and analyze "${video.title}" on VideoDrop:`,
          url: uniqueShareUrl
        });
      } catch (err: any) {
        // User cancelled or share failed
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(uniqueShareUrl);
  const encodedTitle = encodeURIComponent(`Watch and download "${video.title}" on VideoDrop:`);

  const socialLinks = [
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-sky-400'
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-emerald-400'
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Reddit',
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:text-orange-400'
    }
  ];

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#121821] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-rose-500" />
            <h3 id="share-modal-title" className="text-base font-bold text-white">
              Share Analyzed Video
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Preview Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <img
            src={video.thumbnail}
            alt={video.title}
            referrerPolicy="no-referrer"
            className="w-16 h-11 object-cover rounded-lg shrink-0 bg-slate-800"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate" title={video.title}>
              {video.title}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {video.channel}
            </p>
          </div>
        </div>

        {/* Share Link Input & Copy Button */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Unique Shareable Link
          </label>
          <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-rose-500/70 rounded-xl p-1.5 transition-colors">
            <input
              type="text"
              readOnly
              value={uniqueShareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full bg-transparent px-3 text-xs sm:text-sm text-slate-300 font-mono focus:outline-none select-all truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Anyone opening this link will immediately load the video details and download options.
          </p>
        </div>

        {/* Native Mobile Share (if available) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-700/80 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-rose-400" />
            <span>Open System Share Sheet</span>
          </button>
        )}

        {/* Social Share Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Share Directly
          </div>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-colors ${item.color}`}
              >
                <span>{item.name}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
