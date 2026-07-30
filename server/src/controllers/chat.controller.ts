import { Request, Response } from "express";

export const chat = (_req: Request, res: Response) => {
  res.json({
    success: true,
    reply:
      "Hello! I'm your AI Beauty Assistant. How can I help you today?",
  });
};