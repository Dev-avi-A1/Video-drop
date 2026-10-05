import { VideoMetadata, VideoFormat, AnalyzeResponse } from '../types/index.js';
import { generateVideoFormats } from '../../server/services/videoService.js';

/**
 * Mock Provider for development, offline environments, and client testing.
 * Clearly tagged as mock data per development guidelines.
 */
export const MOCK_PROVIDER_NOTICE = 'Development Mock Provider: Utilizing simulated format manifests for testing without external API credentials.';

export const SAMPLE_VIDEOS: Record<string, VideoMetadata> = {
  'aqz-KE-bpKQ': {
    id: 'aqz-KE-bpKQ',
    title: 'Big Buck Bunny (Blender Open Movie - 4K 60FPS)',
    channel: 'Blender Foundation',
    channelUrl: 'https://www.youtube.com/@BlenderFoundation',
    duration: 596,
    thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    viewCount: 18450000,
    uploadDate: '2014-05-18T10:00:00Z',
    description: 'The classic open source 3D animated film produced by the Blender Institute. Creative Commons Attribution 3.0 license.',
    authorized: true,
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
  },
  'dQw4w9WgXcQ': {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    channel: 'Rick Astley',
    channelUrl: 'https://www.youtube.com/@RickAstleyYT',
    duration: 213,
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    viewCount: 1542380000,
    uploadDate: '2009-10-25T06:57:33Z',
    description: 'The official music video for "Never Gonna Give You Up" by Rick Astley.',
    authorized: true,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  'jfKfPfyJRdk': {
    id: 'jfKfPfyJRdk',
    title: '1 A.M Study Session 📚 - [lofi hip hop/chill beats]',
    channel: 'Lofi Girl',
    channelUrl: 'https://www.youtube.com/@LofiGirl',
    duration: 3680,
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    viewCount: 84920000,
    uploadDate: '2022-03-12T16:00:00Z',
    description: 'Peaceful lofi hip hop mix for studying, relaxing, and late night focus sessions.',
    authorized: true,
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  }
};

export function getMockVideoAnalysis(videoId: string): AnalyzeResponse {
  const video = SAMPLE_VIDEOS[videoId] || {
    id: videoId,
    title: `Sample YouTube Video (${videoId})`,
    channel: 'Independent Creator',
    channelUrl: `https://www.youtube.com/watch?v=${videoId}`,
    duration: 420,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    viewCount: 650000,
    uploadDate: new Date().toISOString(),
    description: 'Video retrieved via VideoDrop Development Mock Provider.',
    authorized: true,
    url: `https://www.youtube.com/watch?v=${videoId}`
  };

  const formats = generateVideoFormats(video.duration, video.authorized);

  return {
    success: true,
    video,
    formats,
    isMock: true,
    providerNotice: MOCK_PROVIDER_NOTICE
  };
}
