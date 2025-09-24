import { NextFunction, Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { verifyToken } from "../auth/auth.utils";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const payload: any = verifyToken(token);

    const session = await prisma.session.findFirst({
      where: {
        token,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
    if (!session) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    req.user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
