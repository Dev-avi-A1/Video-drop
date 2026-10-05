import React, { useState } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { VideoResult } from './components/VideoResult.js';
import { LoadingSkeleton } from './components/LoadingSkeleton.js';
import { ErrorMessage } from './components/ErrorMessage.js';
import { HowItWorks } from './components/HowItWorks.js';
import { FeatureCard } from './components/FeatureCard.js';
import { FAQ } from './components/FAQ.js';
import { Footer } from './components/Footer.js';
import { DownloadProgressModal } from './components/DownloadProgressModal.js';
import { ComplianceModal } from './components/ComplianceModal.js';
import { useTheme } from './hooks/useTheme.js';
import { useVideoDownloader } from './hooks/useVideoDownloader.js';
import heroPreviewImg from './assets/images/videodrop_hero_preview_1791212458632.jpg';
import { ShieldCheck, PlayCircle } from 'lucide-react';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);

  const {
    url,
    setUrl,
    isLoading,
    error,
    errorCode,
    video,
    formats,
    isMock,
    providerNotice,
    activeJob,
    isPreparing,
    handleAnalyze,
    handleStartDownload,
    handleCancelDownload,
    handleReset,
    clearError
  } = useVideoDownloader();

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleAnalyze(sampleUrl);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-[#0B0F14] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Top Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenCompliance={() => setIsComplianceOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section with URL Input */}
        <Hero
          url={url}
          onUrlChange={setUrl}
          onSubmit={() => handleAnalyze()}
          isLoading={isLoading}
          hasError={!!error}
          onSelectSample={handleSelectSample}
        />

        {/* Dynamic Content Area: Analysis Result / Skeleton / Error / Hero Showcase */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          {/* Error Banner */}
          {error && (
            <div className="mb-8">
              <ErrorMessage
                message={error}
                code={errorCode}
                onRetry={() => handleAnalyze()}
                onDismiss={clearError}
              />
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && <LoadingSkeleton />}

          {/* Video Metadata & Formats Result */}
          {!isLoading && video && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <VideoResult
                video={video}
                formats={formats}
                isMock={isMock}
                providerNotice={providerNotice}
                onSelectFormat={handleStartDownload}
                onReset={handleReset}
                isDownloading={isPreparing}
              />
            </div>
          )}

          {/* Initial Showcase Card when idle */}
          {!isLoading && !video && !error && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#121821] shadow-2xl group transition-all">
              <div className="relative aspect-video w-full max-h-[380px] overflow-hidden bg-slate-950">
                <img
                  src={heroPreviewImg}
                  alt="VideoDrop Media Pipeline Interface"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    // Styled CSS fallback container per zero-broken-image policy
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121821] via-black/40 to-transparent" />

                {/* Ambient badge in preview */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-slate-700/50 text-xs text-slate-200">
                  <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>High-Fidelity Stream Analyzer</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-semibold">
                      Video & Audio Downloader
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Instant Video Extraction & Multi-Bitrate Output
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                      Paste a YouTube URL above to choose video quality or audio bitrate and request a download from the connected provider.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('https://www.youtube.com/watch?v=aqz-KE-bpKQ')}
                    className="self-start sm:self-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Test with Sample Video
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* Core Features */}
        <FeatureCard />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onOpenCompliance={() => setIsComplianceOpen(true)} />

      {/* Download Progress Modal (Backend Progress Reporting) */}
      <DownloadProgressModal
        job={activeJob}
        onClose={handleCancelDownload}
      />

      {/* Compliance & Legal Modal */}
      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />
    </div>
  );
}
