import React from 'react';
import { Download, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';
import { DownloadJob } from '../types/index.js';
import { useDialog } from '../hooks/useDialog.js';

interface DownloadProgressModalProps {
  job: DownloadJob | null;
  onClose: () => void;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  job,
  onClose
}) => {
  const dialogRef = useDialog(Boolean(job), onClose);
  if (!job) return null;

  const isReady = job.status === 'ready';
  const isFailed = job.status === 'failed';
  const isWorking = !isReady && !isFailed;

  const downloadLabel = `Download ${job.container.toUpperCase()}`;

  const handleTriggerDownload = () => {
    if (job.downloadUrl) {
      const link = document.createElement('a');
      link.href = job.downloadUrl;
      link.setAttribute('download', job.fileName || `video.${job.container}`);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121821] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            {isWorking && <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />}
            {isReady && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {isFailed && <AlertCircle className="w-5 h-5 text-rose-400" />}
            <h3 id="download-modal-title" className="text-base font-bold text-white">
              {isReady
                ? 'Your download is ready'
                : isFailed
                ? 'Download Preparation Failed'
                : 'Preparing your download...'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Target info */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Selected Media File:</div>
          <div className="text-sm font-semibold text-slate-200 truncate" title={job.videoTitle}>
            {job.videoTitle}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="uppercase text-rose-400 font-bold">{job.container}</span>
            <span>·</span>
            <span>{job.quality}</span>
            {job.fileSize && (
              <>
                <span>·</span>
                <span>{job.fileSize}</span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Progress or Completion View */}
        {isWorking && (
          <div className="space-y-4">
            <div className="flex justify-center" role="status" aria-label="Preparing download">
              <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
            </div>
            <p className="text-xs text-center text-slate-400 italic">
              {job.message || 'Waiting for the download provider…'}
            </p>
          </div>
        )}

        {isReady && (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs sm:text-sm">
              Your download link is ready. The provider serves the actual file directly.
            </div>

            <button
              type="button"
              onClick={handleTriggerDownload}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{downloadLabel}</span>
            </button>

            <p className="text-[11px] text-slate-500">
              Links may expire. If the link stops working, request a new download. Some browsers open the file in a new tab; use their Save option.
            </p>
          </div>
        )}

        {isFailed && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {job.error || 'Failed to process media file. Please check video availability.'}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Footer cancel option while working */}
        {isWorking && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
