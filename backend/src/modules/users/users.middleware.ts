import { NextFunction,Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { verifyToken } from "../auth/auth.utils";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const payload: any = verifyToken(token);

    const session = await prisma.session.findFirst({
      where: {
        token,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
    if (!session) return res.status(401).json({ error: "Invalid or expired session" });

    req.user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
