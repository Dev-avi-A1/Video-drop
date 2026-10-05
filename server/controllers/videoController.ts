import { Request, Response } from 'express';
import { validateYouTubeUrl } from '../../src/utils/validators.js';
import { retrieveVideoMetadata } from '../services/videoService.js';
import { createDownloadJob, getDownloadJob, getJobBuffer } from '../services/downloadJobManager.js';

export async function analyzeVideo(req: Request, res: Response) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid YouTube video URL.',
        errorCode: 'EMPTY_URL'
      });
    }

    // Server-side validation
    const validation = validateYouTubeUrl(url);
    if (!validation.isValid || !validation.videoId) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Invalid YouTube URL provided.',
        errorCode: validation.errorCode || 'INVALID_URL'
      });
    }

    // Retrieve metadata and available formats
    try {
      const data = await retrieveVideoMetadata(url);
      return res.status(200).json({
        success: true,
        video: data.video,
        formats: data.formats,
        isMock: data.isMock,
        providerNotice: data.providerNotice
      });
    } catch (err: any) {
      if (err.message === 'VIDEO_UNAVAILABLE') {
        return res.status(404).json({
          success: false,
          error: 'Video unavailable: This video is private, restricted, or no longer accessible on YouTube.',
          errorCode: 'VIDEO_UNAVAILABLE'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while analyzing the video. Please verify the link and try again.',
        errorCode: 'API_ERROR'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing request.',
      errorCode: 'API_ERROR'
    });
  }
}

export function startDownload(req: Request, res: Response) {
  try {
    const { videoId, videoTitle, formatId, formatType, container, quality } = req.body;

    if (!videoId || !formatId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: videoId and formatId are required.'
      });
    }

    const job = createDownloadJob({
      videoId,
      videoTitle: videoTitle || 'YouTube Video',
      formatId,
      formatType: formatType === 'audio' ? 'audio' : 'video',
      container: container || (formatType === 'audio' ? 'mp3' : 'mp4'),
      quality: quality || '1080p'
    });

    return res.status(201).json({
      success: true,
      jobId: job.id,
      job
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate download job.'
    });
  }
}

export function getDownloadStatus(req: Request, res: Response) {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({
      success: false,
      error: 'Missing jobId parameter.'
    });
  }

  const job = getDownloadJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Download session expired or not found. Please initiate a new download.',
      errorCode: 'NOT_FOUND'
    });
  }

  return res.status(200).json({
    success: true,
    job
  });
}

export function serveDownloadFile(req: Request, res: Response) {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).send('Missing jobId parameter.');
  }

  const fileData = getJobBuffer(jobId);

  if (!fileData) {
    return res.status(404).send('File expired or not found.');
  }

  res.setHeader('Content-Type', fileData.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
  res.setHeader('Content-Length', fileData.buffer.length);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  return res.end(fileData.buffer);
}

export function healthCheck(req: Request, res: Response) {
  return res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'VideoDrop API Engine',
    version: '1.0.0'
  });
}
