import { Request, Response } from "express";

import { AuthService } from "./auth.service";

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.signup(req.body);
      res.json(user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      res.status(400).json({ error: errorMessage });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      res.status(400).json({ error: errorMessage });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("No token provided");
      await AuthService.logout(token);
      res.json({ success: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      res.status(400).json({ error: errorMessage });
    }
  }
}
