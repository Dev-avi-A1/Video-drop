import React, { useRef } from 'react';
import { Link2, Clipboard, X, Loader2, ArrowRight } from 'lucide-react';

interface UrlInputProps {
  url: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasError?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  url,
  onChange,
  onSubmit,
  isLoading,
  hasError
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text.trim());
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    } catch {
      // In case clipboard permission is denied or blocked in iframe
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative flex flex-col sm:flex-row items-center bg-[#121821] border ${
          hasError 
            ? 'border-rose-500/80 ring-1 ring-rose-500/30' 
            : 'border-slate-800 focus-within:border-rose-500/70 focus-within:ring-1 focus-within:ring-rose-500/40'
        } rounded-xl p-1.5 shadow-2xl transition-all duration-200`}
      >
        {/* URL Icon & Input */}
        <div className="flex items-center w-full px-3 py-2 sm:py-0">
          <Link2 className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
            aria-label="YouTube video URL input"
          />

          {/* Clear button */}
          {url && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Paste button */}
          {!url && !isLoading && (
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors ml-1 border border-slate-700/40"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          )}
        </div>

        {/* Submit action button */}
        <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !url.trim()}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
