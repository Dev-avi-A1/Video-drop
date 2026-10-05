import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { UrlInput } from './UrlInput.js';

interface HeroProps {
  url: string;
  onUrlChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasError?: boolean;
  onSelectSample: (sampleUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  hasError,
  onSelectSample
}) => {
  const sampleLinks = [
    { label: 'Big Buck Bunny (Open Movie)', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    { label: 'Rick Astley (Classic)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { label: 'Lofi Girl (Chill Beats)', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' }
  ];

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow and subtle ambient gradient */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none" 
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Editorial Subtitle Kicker (Clean unboxed typography) */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple · Fast · Secure</span>
        </div>

        {/* Large Centered Headline with text-wrap: balance */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1] [text-wrap:balance]">
          Download Videos.{' '}
          <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
            Simply.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed [text-wrap:balance]">
          Paste a YouTube URL, choose your preferred quality, and request a real video or audio download.
        </p>

        {/* Main URL Input Box */}
        <div className="max-w-2xl mx-auto pt-2">
          <UrlInput
            url={url}
            onChange={onUrlChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            hasError={hasError}
          />

          {/* Quick sample selector buttons */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500">Try sample:</span>
            {sampleLinks.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => onSelectSample(sample.url)}
                className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-md transition-all text-[11px] whitespace-nowrap cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Security & Privacy Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>We don't store your URLs longer than necessary.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
