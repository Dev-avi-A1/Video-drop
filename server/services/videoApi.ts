import { generateVideoFormats, retrieveVideoMetadata } from './videoService.js';

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

function failure(error: string, status: number, errorCode = 'API_ERROR'): Response {
  return jsonResponse({ success: false, isMock: false, error, errorCode }, status);
}

export async function handleVideoApi(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  if (pathname === '/api/health') {
    if (request.method !== 'GET') return failure('Method not allowed.', 405);
    return jsonResponse({ status: 'healthy', downloaderConfigured: Boolean(process.env.VIDEO_DOWNLOADER_URL) });
  }
  if (!['/api/analyze', '/api/download'].includes(pathname)) return failure('API route not found.', 404);
  if (request.method !== 'POST') return failure('Method not allowed.', 405);
  if (!request.headers.get('content-type')?.includes('application/json')) return failure('Send a JSON request.', 415);
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 16384) return failure('Request is too large.', 413);
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return failure('Invalid request body.', 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return failure('Invalid JSON request.', 400);
  }
  if (pathname === '/api/analyze') {
    if (typeof body.url !== 'string') return failure('Enter a valid YouTube URL.', 400, 'INVALID_URL');
    try {
      const result = await retrieveVideoMetadata(body.url, request.signal);
      return jsonResponse(result, result.success ? 200 : 400);
    } catch {
      return failure('Video analysis was interrupted. Please try again.', 502);
    }
  }
  if (typeof body.videoId !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(body.videoId)) {
    return failure('Invalid video ID.', 400, 'INVALID_URL');
  }
  const format = generateVideoFormats().find((candidate) => candidate.id === body.formatId);
  if (!format) return failure('Choose a supported output format.', 400, 'DOWNLOAD_UNAVAILABLE');
  const endpoint = process.env.VIDEO_DOWNLOADER_URL;
  if (!endpoint) {
    return failure('The downloader is not configured. The site owner must connect a Cobalt instance using VIDEO_DOWNLOADER_URL.', 503, 'DOWNLOAD_UNAVAILABLE');
  }
  try {
    const providerUrl = new URL(endpoint);
    if (providerUrl.protocol !== 'https:' || providerUrl.username || providerUrl.password || providerUrl.search || providerUrl.hash) {
      return failure('The downloader configuration is invalid. Contact the site owner.', 503, 'DOWNLOAD_UNAVAILABLE');
    }
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      redirect: 'error',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(30000)]),
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${body.videoId}`,
        videoQuality: format.type === 'video' ? format.id.slice('video-'.length) : 'max',
        downloadMode: format.type === 'audio' ? 'audio' : 'auto',
        audioFormat: 'mp3',
        audioBitrate: format.audioBitrate || '128',
        youtubeVideoCodec: 'h264',
        youtubeVideoContainer: 'mp4',
        filenameStyle: 'pretty',
        alwaysProxy: true,
        localProcessing: 'disabled'
      })
    });
    if (response.status === 429) return failure('The download provider is busy or rate limited. Please try again later.', 429, 'RATE_LIMITED');
    if (response.status === 401 || response.status === 403) return failure('The download provider denied access. The site owner must configure an instance that permits this integration.', 502, 'DOWNLOAD_UNAVAILABLE');
    if (!response.headers.get('content-type')?.includes('application/json')) return failure('The download provider returned an invalid response.', 502);
    const result = await response.json();
    if (!response.ok || result.status === 'error') return failure('The provider could not download this video. It may be unavailable, require sign-in, or be unsupported by the provider.', 502, 'DOWNLOAD_UNAVAILABLE');
    if (!['tunnel', 'redirect'].includes(result.status) || typeof result.url !== 'string') {
      return failure('The provider did not return a downloadable file. Try another quality or video.', 502, 'DOWNLOAD_UNAVAILABLE');
    }
    const downloadUrl = new URL(result.url);
    if (downloadUrl.protocol !== 'https:' || downloadUrl.username || downloadUrl.password) return failure('The provider returned an unsafe download link.', 502);
    const fallbackName = `video-${body.videoId}.${format.container}`;
    const fileName = (typeof result.filename === 'string' ? result.filename : fallbackName)
      .replace(/[\x00-\x1f\x7f/\\]/g, '_').slice(0, 200) || fallbackName;
    const extension = fileName.split('.').pop()?.toLowerCase();
    const container = ['mp4', 'webm', 'mkv', 'mp3', 'm4a', 'opus', 'ogg', 'wav'].includes(extension || '') ? extension : format.container;
    const job = {
      id: crypto.randomUUID(),
      videoId: body.videoId,
      videoTitle: typeof body.videoTitle === 'string' ? body.videoTitle.slice(0, 300) : 'YouTube video',
      formatId: format.id,
      formatType: format.type,
      container,
      quality: format.quality,
      status: 'ready',
      progress: 100,
      message: 'The provider returned a download link.',
      downloadUrl: downloadUrl.href,
      fileName,
      createdAt: Date.now(),
      completedAt: Date.now()
    };
    return jsonResponse({ success: true, jobId: job.id, job });
  } catch {
    return failure('The download provider is unreachable or timed out. Please try again.', 502, 'NETWORK_ERROR');
  }
}
