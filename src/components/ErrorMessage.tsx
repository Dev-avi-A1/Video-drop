import React from 'react';
import { AlertCircle, AlertTriangle, WifiOff, FileX, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  code?: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  code,
  onRetry,
  onDismiss
}) => {
  const getIcon = () => {
    switch (code) {
      case 'NETWORK_ERROR':
        return <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
      case 'VIDEO_UNAVAILABLE':
      case 'DOWNLOAD_UNAVAILABLE':
        return <FileX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
      case 'RATE_LIMITED':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
    }
  };

  const getTitle = () => {
    switch (code) {
      case 'EMPTY_URL':
        return 'URL Required';
      case 'INVALID_URL':
      case 'INVALID_FORMAT':
        return 'Invalid YouTube URL';
      case 'UNSUPPORTED_HOST':
        return 'Unsupported Website';
      case 'VIDEO_UNAVAILABLE':
        return 'Video Unavailable';
      case 'DOWNLOAD_UNAVAILABLE':
        return 'Download Unavailable';
      case 'RATE_LIMITED':
        return 'Too Many Requests';
      case 'NETWORK_ERROR':
        return 'Connection Issue';
      default:
        return 'Unable to Process Video';
    }
  };

  return (
    <div role="alert" className="w-full bg-[#121821] border border-rose-500/30 rounded-xl p-4 sm:p-5 text-slate-200 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div>
            <h4 className="text-sm font-semibold text-rose-300">
              {getTitle()}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {message}
            </p>
            {code === 'DOWNLOAD_UNAVAILABLE' && (
              <p className="text-xs text-slate-400 mt-2">
                Check the provider configuration or try another quality. Source access controls and provider availability still apply.
              </p>
            )}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-rose-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
