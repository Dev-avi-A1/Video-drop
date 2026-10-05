import { useState, useRef, useEffect } from 'react';
import type { VideoMetadata, VideoFormat, DownloadJob } from '../types/index.js';
import { validateYouTubeUrl } from '../utils/validators.js';
import { videoService } from '../services/videoService.js';

export function useVideoDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [formats, setFormats] = useState<VideoFormat[]>([]);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const analysisRequest = useRef<AbortController | null>(null);
  const downloadRequest = useRef<AbortController | null>(null);

  const handleCancelDownload = () => {
    downloadRequest.current?.abort();
    downloadRequest.current = null;
    setIsPreparing(false);
    setActiveJob(null);
  };

  const handleAnalyze = async (overrideUrl?: string) => {
    analysisRequest.current?.abort();
    analysisRequest.current = null;
    handleCancelDownload();
    setIsLoading(false);
    setError(null);
    setErrorCode(null);
    setVideo(null);
    setFormats([]);
    setProviderNotice(null);
    const targetUrl = (overrideUrl ?? url).trim();
    setUrl(targetUrl);
    const validation = validateYouTubeUrl(targetUrl);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid YouTube URL.');
      setErrorCode(validation.errorCode || 'INVALID_URL');
      return;
    }
    const controller = new AbortController();
    analysisRequest.current = controller;
    setIsLoading(true);
    try {
      const response = await videoService.analyze(targetUrl, controller.signal);
      if (analysisRequest.current !== controller) return;
      if (!response.success || !response.video) {
        setError(response.error || 'Unable to retrieve video information.');
        setErrorCode(response.errorCode || 'API_ERROR');
        return;
      }
      setVideo(response.video);
      setFormats(response.formats || []);
      setProviderNotice(response.providerNotice || null);
      const address = new URL(window.location.href);
      address.searchParams.delete('url');
      address.searchParams.set('v', response.video.id);
      window.history.replaceState(null, '', address.toString());
    } catch (caught) {
      if (analysisRequest.current !== controller) return;
      setError(caught instanceof Error ? caught.message : 'A network error occurred. Please try again.');
      setErrorCode('NETWORK_ERROR');
    } finally {
      if (analysisRequest.current === controller) {
        analysisRequest.current = null;
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUrl = params.get('v') || params.get('url');
    if (initialUrl) void handleAnalyze(initialUrl);
    return () => {
      analysisRequest.current?.abort();
      downloadRequest.current?.abort();
      analysisRequest.current = null;
      downloadRequest.current = null;
    };
  }, []);

  const handleStartDownload = async (format: VideoFormat) => {
    if (!video) return;
    handleCancelDownload();
    setError(null);
    setErrorCode(null);
    const controller = new AbortController();
    downloadRequest.current = controller;
    setIsPreparing(true);
    setActiveJob({
      id: 'pending',
      videoId: video.id,
      videoTitle: video.title,
      formatId: format.id,
      formatType: format.type,
      container: format.container,
      quality: format.quality,
      status: 'preparing',
      progress: 0,
      message: 'Requesting a real download link from the provider…',
      createdAt: Date.now()
    });
    try {
      const response = await videoService.startDownload({
        videoId: video.id,
        videoTitle: video.title,
        formatId: format.id
      }, controller.signal);
      if (downloadRequest.current !== controller) return;
      if (!response.success || !response.job?.downloadUrl) {
        setActiveJob(null);
        setError(response.error || 'The provider did not return a download link.');
        setErrorCode(response.errorCode || 'DOWNLOAD_ERROR');
        return;
      }
      setActiveJob(response.job);
    } catch (caught) {
      if (downloadRequest.current !== controller) return;
      setActiveJob(null);
      setError(caught instanceof Error ? caught.message : 'Could not initiate download. Please try again.');
      setErrorCode('DOWNLOAD_ERROR');
    } finally {
      if (downloadRequest.current === controller) {
        downloadRequest.current = null;
        setIsPreparing(false);
      }
    }
  };

  const handleReset = () => {
    analysisRequest.current?.abort();
    analysisRequest.current = null;
    handleCancelDownload();
    setIsLoading(false);
    setUrl('');
    setVideo(null);
    setFormats([]);
    setProviderNotice(null);
    setError(null);
    setErrorCode(null);
    const address = new URL(window.location.href);
    address.searchParams.delete('v');
    address.searchParams.delete('url');
    window.history.replaceState(null, '', address.toString());
  };

  return {
    url, setUrl, isLoading, error, errorCode, video, formats, isMock: false, providerNotice,
    activeJob, isPreparing, handleAnalyze, handleStartDownload, handleCancelDownload, handleReset,
    clearError: () => { setError(null); setErrorCode(null); }
  };
}
