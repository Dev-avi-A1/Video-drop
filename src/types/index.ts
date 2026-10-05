export interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  channelUrl?: string;
  duration: number; // in seconds
  thumbnail: string;
  viewCount?: number;
  uploadDate?: string;
  description?: string;
  authorized: boolean;
  url: string;
}

export type FormatType = 'video' | 'audio';
export type VideoContainer = 'mp4' | 'webm';
export type AudioContainer = 'mp3' | 'm4a';

export interface VideoFormat {
  id: string;
  type: FormatType;
  container: VideoContainer | AudioContainer;
  quality: string; // '1080p', '720p', '480p', '360p', '320 kbps', '128 kbps'
  resolution?: string; // '1920x1080', '1280x720', etc.
  fps?: number;
  audioBitrate?: string;
  estimatedSize: string; // '142.5 MB'
  sizeInBytes: number;
  isDownloadable: boolean;
  restrictionReason?: string;
  codec?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  video?: VideoMetadata;
  formats?: VideoFormat[];
  isMock: boolean;
  providerNotice?: string;
  error?: string;
  errorCode?: 'INVALID_URL' | 'UNSUPPORTED_URL' | 'VIDEO_UNAVAILABLE' | 'API_ERROR' | 'NETWORK_ERROR' | 'DOWNLOAD_UNAVAILABLE' | 'RATE_LIMITED';
}

export type JobStatus = 'idle' | 'preparing' | 'processing' | 'ready' | 'failed';

export interface DownloadJob {
  id: string;
  videoId: string;
  videoTitle: string;
  formatId: string;
  formatType: FormatType;
  container: string;
  quality: string;
  status: JobStatus;
  progress: number; // 0 - 100
  message: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
  createdAt: number;
  completedAt?: number;
  error?: string;
}

export interface DownloadStartResponse {
  success: boolean;
  jobId?: string;
  error?: string;
}

export interface DownloadStatusResponse {
  success: boolean;
  job?: DownloadJob;
  error?: string;
}
