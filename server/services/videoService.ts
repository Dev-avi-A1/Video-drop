import { VideoMetadata, VideoFormat } from '../../src/types/index.js';
import { extractYouTubeVideoId } from '../../src/utils/validators.js';

interface SeededSample {
  id: string;
  title: string;
  channel: string;
  channelUrl: string;
  duration: number;
  thumbnail: string;
  viewCount: number;
  uploadDate: string;
  description: string;
  authorized: boolean;
}

// Curated library of verified test samples for reliable local development & testing
const PRESET_VIDEOS: Record<string, SeededSample> = {
  'aqz-KE-bpKQ': {
    id: 'aqz-KE-bpKQ',
    title: 'Big Buck Bunny (Blender Open Movie - 4K 60FPS)',
    channel: 'Blender Foundation',
    channelUrl: 'https://www.youtube.com/@BlenderFoundation',
    duration: 596,
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    viewCount: 18450000,
    uploadDate: '2014-05-18T10:00:00Z',
    description: 'The classic open source 3D animated film produced by the Blender Institute. Creative Commons Attribution 3.0 license.',
    authorized: true
  },
  'dQw4w9WgXcQ': {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    channel: 'Rick Astley',
    channelUrl: 'https://www.youtube.com/@RickAstleyYT',
    duration: 213,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    viewCount: 1542380000,
    uploadDate: '2009-10-25T06:57:33Z',
    description: 'The official video for "Never Gonna Give You Up" by Rick Astley. Worldwide pop classic.',
    authorized: true
  },
  'jfKfPfyJRdk': {
    id: 'jfKfPfyJRdk',
    title: '1 A.M Study Session 📚 - [lofi hip hop/chill beats]',
    channel: 'Lofi Girl',
    channelUrl: 'https://www.youtube.com/@LofiGirl',
    duration: 3680,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    viewCount: 84920000,
    uploadDate: '2022-03-12T16:00:00Z',
    description: 'Peaceful lofi hip hop mix for studying, relaxing, and late night focus sessions.',
    authorized: true
  },
  'dtp6bS6ws3c': {
    id: 'dtp6bS6ws3c',
    title: 'Apple Vision Pro: Tomorrow’s Tech Today',
    channel: 'Marques Brownlee',
    channelUrl: 'https://www.youtube.com/@mkbhd',
    duration: 1248,
    thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
    viewCount: 12400000,
    uploadDate: '2024-02-05T14:30:00Z',
    description: 'Full in-depth walkthrough of spatial computing, eye tracking, and hand gestures.',
    authorized: true
  }
};

/**
 * Builds realistic formats list scaled to the video duration
 */
export function generateVideoFormats(duration: number, isAuthorized: boolean = true): VideoFormat[] {
  // Rough estimate of sizes: 
  // 1080p ~ 3.5 MB/min
  // 720p ~ 1.8 MB/min
  // 480p ~ 0.9 MB/min
  // 360p ~ 0.5 MB/min
  // MP3 (320kbps) ~ 2.4 MB/min
  // M4A (128kbps) ~ 0.96 MB/min
  const minutes = Math.max(1, duration / 60);

  const formatSize = (mb: number): { formatted: string; bytes: number } => {
    const totalMb = Math.round(mb * 10) / 10;
    const bytes = Math.round(totalMb * 1024 * 1024);
    return {
      formatted: `${totalMb >= 1000 ? (totalMb / 1024).toFixed(1) + ' GB' : totalMb + ' MB'}`,
      bytes
    };
  };

  const s1080 = formatSize(minutes * 3.6);
  const s720 = formatSize(minutes * 1.9);
  const s480 = formatSize(minutes * 0.95);
  const s360 = formatSize(minutes * 0.52);
  const sMp3 = formatSize(minutes * 2.4);
  const sM4a = formatSize(minutes * 0.96);

  return [
    {
      id: 'mp4-1080p',
      type: 'video',
      container: 'mp4',
      quality: '1080p',
      resolution: '1920x1080',
      fps: 60,
      audioBitrate: '192 kbps',
      estimatedSize: s1080.formatted,
      sizeInBytes: s1080.bytes,
      isDownloadable: isAuthorized,
      codec: 'H.264 / AAC',
      restrictionReason: isAuthorized ? undefined : 'Platform DRM protection prevents external re-encoding.'
    },
    {
      id: 'mp4-720p',
      type: 'video',
      container: 'mp4',
      quality: '720p',
      resolution: '1280x720',
      fps: 30,
      audioBitrate: '128 kbps',
      estimatedSize: s720.formatted,
      sizeInBytes: s720.bytes,
      isDownloadable: isAuthorized,
      codec: 'H.264 / AAC'
    },
    {
      id: 'mp4-480p',
      type: 'video',
      container: 'mp4',
      quality: '480p',
      resolution: '854x480',
      fps: 30,
      audioBitrate: '96 kbps',
      estimatedSize: s480.formatted,
      sizeInBytes: s480.bytes,
      isDownloadable: isAuthorized,
      codec: 'H.264 / AAC'
    },
    {
      id: 'mp4-360p',
      type: 'video',
      container: 'mp4',
      quality: '360p',
      resolution: '640x360',
      fps: 30,
      audioBitrate: '64 kbps',
      estimatedSize: s360.formatted,
      sizeInBytes: s360.bytes,
      isDownloadable: isAuthorized,
      codec: 'H.264 / AAC'
    },
    {
      id: 'audio-mp3-320',
      type: 'audio',
      container: 'mp3',
      quality: '320 kbps',
      audioBitrate: '320 kbps',
      estimatedSize: sMp3.formatted,
      sizeInBytes: sMp3.bytes,
      isDownloadable: isAuthorized,
      codec: 'MP3 Stereo High-Res'
    },
    {
      id: 'audio-m4a-128',
      type: 'audio',
      container: 'm4a',
      quality: '128 kbps',
      audioBitrate: '128 kbps',
      estimatedSize: sM4a.formatted,
      sizeInBytes: sM4a.bytes,
      isDownloadable: isAuthorized,
      codec: 'AAC-LC'
    }
  ];
}

/**
 * Service to fetch video metadata via verified seed samples, official oEmbed, or mock provider
 */
export async function retrieveVideoMetadata(rawUrl: string): Promise<{
  video: VideoMetadata;
  formats: VideoFormat[];
  isMock: boolean;
  providerNotice: string;
}> {
  const videoId = extractYouTubeVideoId(rawUrl);
  if (!videoId) {
    throw new Error('INVALID_URL');
  }

  // 1. Check if we have pre-seeded high-fidelity data
  if (PRESET_VIDEOS[videoId]) {
    const seed = PRESET_VIDEOS[videoId];
    const formats = generateVideoFormats(seed.duration, seed.authorized);
    return {
      video: {
        id: seed.id,
        title: seed.title,
        channel: seed.channel,
        channelUrl: seed.channelUrl,
        duration: seed.duration,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        viewCount: seed.viewCount,
        uploadDate: seed.uploadDate,
        description: seed.description,
        authorized: seed.authorized,
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      formats,
      isMock: true,
      providerNotice: 'Development Mock Provider: Utilizing pre-seeded metadata and verified mock format manifests.'
    };
  }

  // 2. Fetch live metadata via YouTube official oEmbed endpoint (free, public, authorized by YouTube)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(oembedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VideoDrop-Metadata-Client/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (response.status === 404 || response.status === 401 || response.status === 403) {
      const err = new Error('VIDEO_UNAVAILABLE');
      (err as any).status = response.status;
      throw err;
    }

    if (response.ok) {
      const data: any = await response.json();
      const standardDuration = 345; // oEmbed does not return duration, estimate average 5:45
      const formats = generateVideoFormats(standardDuration, true);

      return {
        video: {
          id: videoId,
          title: data.title || 'YouTube Video',
          channel: data.author_name || 'YouTube Creator',
          channelUrl: data.author_url || `https://www.youtube.com/watch?v=${videoId}`,
          duration: standardDuration,
          thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          viewCount: 1250000,
          uploadDate: new Date().toISOString(),
          description: `Authorized media metadata retrieved from YouTube oEmbed API for creator: ${data.author_name}.`,
          authorized: true,
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        formats,
        isMock: true,
        providerNotice: 'Connected via YouTube Public oEmbed API + Development Media Stream Provider.'
      };
    }
  } catch (err: any) {
    if (err.message === 'VIDEO_UNAVAILABLE') {
      throw err;
    }
    // Fallback gracefully to standard fallback format generator
  }

  // 3. Fallback for offline/mock environments
  const fallbackDuration = 480;
  const formats = generateVideoFormats(fallbackDuration, true);
  return {
    video: {
      id: videoId,
      title: `YouTube Video (${videoId})`,
      channel: 'Verified YouTube Creator',
      channelUrl: `https://www.youtube.com/watch?v=${videoId}`,
      duration: fallbackDuration,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      viewCount: 450000,
      uploadDate: new Date().toISOString(),
      description: 'Public video metadata retrieved in local development sandbox mode.',
      authorized: true,
      url: `https://www.youtube.com/watch?v=${videoId}`
    },
    formats,
    isMock: true,
    providerNotice: 'Development Mock Provider: Utilizing simulated format manifests for local testing.'
  };
}
