import { Router } from 'express';
import {
  analyzeVideo,
  startDownload,
  getDownloadStatus,
  serveDownloadFile,
  healthCheck
} from '../controllers/videoController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply rate limiting to analyze and download triggers
router.post('/analyze', rateLimiter, analyzeVideo);
router.post('/download', rateLimiter, startDownload);

// Download status polling and file delivery
router.get('/download/status/:jobId', getDownloadStatus);
router.get('/download/file/:jobId', serveDownloadFile);

// Health check endpoint
router.get('/health', healthCheck);

export default router;
