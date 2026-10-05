import type { AnalyzeResponse, VideoFormat } from '../../src/types/index.js';
import { validateYouTubeUrl } from '../../src/utils/validators.js';

export function generateVideoFormats(): VideoFormat[] {
  const qualities = ['max', '4320', '2160', '1440', '1080', '720', '480', '360', '240', '144'];
  const videoFormats: VideoFormat[] = qualities.map((quality) => ({
    id: `video-${quality}`,
    type: 'video',
    container: 'mp4',
    quality: quality === 'max' ? 'Best available' : `${quality}p`,
    estimatedSize: 'Determined by source',
    sizeInBytes: 0,
    isDownloadable: true
  }));
  const audioFormats: VideoFormat[] = ['320', '256', '128', '96', '64', '8'].map((bitrate) => ({
    id: `audio-${bitrate}`,
    type: 'audio',
    container: 'mp3',
    quality: `${bitrate} kbps`,
    audioBitrate: bitrate,
    estimatedSize: 'Determined by source',
    sizeInBytes: 0,
    isDownloadable: true
  }));
  return [...videoFormats, ...audioFormats];
}

export async function retrieveVideoMetadata(input: string, signal?: AbortSignal): Promise<AnalyzeResponse> {
  const validation = validateYouTubeUrl(input);
  if (!validation.isValid || !validation.videoId || !validation.normalizedUrl) {
    return { success: false, isMock: false, error: validation.error, errorCode: 'INVALID_URL' };
  }
  const videoId = validation.videoId;
  let title = `YouTube video ${videoId}`;
  let channel = 'Creator information unavailable';
  let metadataAvailable = false;
  try {
    const endpoint = new URL('https://www.youtube.com/oembed');
    endpoint.searchParams.set('url', validation.normalizedUrl);
    endpoint.searchParams.set('format', 'json');
    const response = await fetch(endpoint, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000)
    });
    if (response.ok) {
      const metadata = await response.json();
      if (typeof metadata.title === 'string') title = metadata.title;
      if (typeof metadata.author_name === 'string') channel = metadata.author_name;
      metadataAvailable = true;
    }
  } catch {
    if (signal?.aborted) throw new Error('Request cancelled.');
  }
  return {
    success: true,
    isMock: false,
    video: {
      id: videoId,
      title,
      channel,
      duration: 0,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      authorized: false,
      url: validation.normalizedUrl
    },
    formats: generateVideoFormats(),
    providerNotice: `${metadataAvailable ? 'Live YouTube metadata.' : 'Metadata is unavailable; you can still attempt a download.'} Quality options are requests, not verified source formats. Actual quality depends on the video and downloader.`
  };
}
