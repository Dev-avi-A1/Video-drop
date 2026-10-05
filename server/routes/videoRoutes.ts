import { Router } from 'express';
import { videoApi } from '../controllers/videoController.js';

const router = Router();

router.all('/analyze', videoApi);
router.all('/download', videoApi);

router.all('/health', videoApi);
router.use(videoApi);

export default router;
