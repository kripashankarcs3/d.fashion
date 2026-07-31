import { Request, Response, NextFunction } from "express";

export const asyncHandler = <P extends Record<string, string> = any>(
  fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
