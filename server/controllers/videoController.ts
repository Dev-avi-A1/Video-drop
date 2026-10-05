import type { Request, Response } from 'express';
import { handleVideoApi } from '../services/videoApi.js';

export async function videoApi(req: Request, res: Response) {
  try {
    const request = new globalThis.Request(`https://videodrop.local${req.originalUrl}`, {
      method: req.method,
      headers: { 'Content-Type': req.get('content-type') || '' },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body) } : {})
    });
    const response = await handleVideoApi(request);
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.status(response.status).send(await response.text());
  } catch {
    res.status(500).json({ success: false, error: 'An unexpected API error occurred.' });
  }
}
