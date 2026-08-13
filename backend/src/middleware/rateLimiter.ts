import type { NextFunction, Request, Response } from 'express';

interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}

const defaultOptions: Required<RateLimiterOptions> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
};

const clients = new Map<string, { count: number; firstRequestTime: number }>();

function getClientKey(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function rateLimiter(options: RateLimiterOptions = {}) {
  const { windowMs, maxRequests, message } = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const key = getClientKey(req);
    const now = Date.now();
    const entry = clients.get(key);

    if (!entry || now - entry.firstRequestTime > windowMs) {
      clients.set(key, { count: 1, firstRequestTime: now });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.status(429).json({ error: message });
      return;
    }

    clients.set(key, entry);
    next();
  };
}
