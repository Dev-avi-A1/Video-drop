import type { AnalyzeResponse, DownloadStartResponse } from '../types/index.js';

async function postJson<Result>(path: string, body: unknown, signal?: AbortSignal): Promise<Result> {
  const response = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(45000)]) : AbortSignal.timeout(45000)
  });
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The download API is unavailable. Please try again after the site has been deployed correctly.');
  }
  return response.json() as Promise<Result>;
}

export const videoService = {
  analyze(url: string, signal?: AbortSignal): Promise<AnalyzeResponse> {
    return postJson('analyze', { url }, signal);
  },
  startDownload(params: { videoId: string; videoTitle: string; formatId: string }, signal?: AbortSignal): Promise<DownloadStartResponse> {
    return postJson('download', params, signal);
  }
};
