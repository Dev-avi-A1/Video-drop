import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoMetadata, VideoFormat, DownloadJob } from '../types/index.js';
import { validateYouTubeUrl } from '../utils/validators.js';
import { videoService } from '../services/videoService.js';

export function useVideoDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [formats, setFormats] = useState<VideoFormat[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);

  // Download state
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl !== undefined ? overrideUrl : url).trim();
    if (overrideUrl !== undefined) {
      setUrl(targetUrl);
    }

    // Reset previous states
    setError(null);
    setErrorCode(null);

    // Client-side validation
    const validation = validateYouTubeUrl(targetUrl);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid YouTube URL.');
      setErrorCode(validation.errorCode || 'INVALID_URL');
      return;
    }

    setIsLoading(true);
    setActiveJob(null);
    stopPolling();

    try {
      const response = await videoService.analyze(targetUrl);

      if (!response.success || !response.video) {
        setError(response.error || 'Unable to retrieve video information. Please try again.');
        setErrorCode(response.errorCode || 'API_ERROR');
        setVideo(null);
        setFormats([]);
        return;
      }

      setVideo(response.video);
      setFormats(response.formats || []);
      setIsMock(response.isMock);
      setProviderNotice(response.providerNotice || null);

      // Synchronize unique shareable URL in browser address bar
      if (typeof window !== 'undefined') {
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.set('v', response.video.id);
        window.history.replaceState(null, '', urlObj.toString());
      }
    } catch {
      setError('A network error occurred while analyzing the video. Please check your connection.');
      setErrorCode('NETWORK_ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial deep-link check on page load (?v=VIDEO_ID or ?url=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const videoParam = params.get('v') || params.get('url');
      if (videoParam) {
        const initialUrl = videoParam.startsWith('http')
          ? videoParam
          : `https://www.youtube.com/watch?v=${videoParam}`;
        setUrl(initialUrl);
        handleAnalyze(initialUrl);
      }
    }
  }, []);

  const handleStartDownload = async (format: VideoFormat) => {
    if (!video) return;

    if (!format.isDownloadable) {
      setError(format.restrictionReason || 'This format is currently unavailable for authorized download.');
      setErrorCode('DOWNLOAD_UNAVAILABLE');
      return;
    }

    setError(null);
    setErrorCode(null);
    setIsPreparing(true);
    stopPolling();

    // Optimistic initial job state
    setActiveJob({
      id: 'pending',
      videoId: video.id,
      videoTitle: video.title,
      formatId: format.id,
      formatType: format.type,
      container: format.container,
      quality: format.quality,
      status: 'preparing',
      progress: 5,
      message: 'Contacting authorized stream origin...',
      createdAt: Date.now()
    });

    try {
      const res = await videoService.startDownload({
        videoId: video.id,
        videoTitle: video.title,
        formatId: format.id,
        formatType: format.type,
        container: format.container,
        quality: format.quality
      });

      if (!res.success || !res.jobId) {
        throw new Error(res.error || 'Failed to start download job');
      }

      const jobId = res.jobId;

      // Start polling backend/client status
      pollTimerRef.current = setInterval(async () => {
        const statusRes = await videoService.getStatus(jobId);
        if (statusRes.success && statusRes.job) {
          const currentJob = statusRes.job;
          setActiveJob(currentJob);

          if (currentJob.status === 'ready' || currentJob.status === 'failed') {
            stopPolling();
            setIsPreparing(false);
          }
        } else {
          stopPolling();
          setIsPreparing(false);
          setError('Failed to track download preparation. Please try again.');
          setErrorCode('DOWNLOAD_ERROR');
        }
      }, 450);
    } catch (err: any) {
      stopPolling();
      setIsPreparing(false);
      setActiveJob(null);
      setError(err.message || 'Could not initiate download. Please try again.');
      setErrorCode('DOWNLOAD_ERROR');
    }
  };

  const handleCancelDownload = () => {
    stopPolling();
    setIsPreparing(false);
    setActiveJob(null);
  };

  const handleReset = () => {
    stopPolling();
    setUrl('');
    setVideo(null);
    setFormats([]);
    setError(null);
    setErrorCode(null);
    setActiveJob(null);
    setIsPreparing(false);

    // Clean URL query parameters
    if (typeof window !== 'undefined') {
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.delete('v');
      urlObj.searchParams.delete('url');
      window.history.replaceState(null, '', urlObj.pathname + (urlObj.hash || ''));
    }
  };

  return {
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
    clearError: () => {
      setError(null);
      setErrorCode(null);
    }
  };
}
