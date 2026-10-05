import type { Config } from '@netlify/functions';
import { handleVideoApi } from '../../server/services/videoApi.js';

export default async (request: Request) => handleVideoApi(request);

export const config: Config = { path: '/api/*' };
