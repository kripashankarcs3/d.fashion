import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
  email?: string;
}

let firebaseApp: App | null = null;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
  firebaseApp = existingApp ?? initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  return firebaseApp;
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const firebase = initFirebase();

    if (firebase) {
      try {
        const decoded = await getAuth(firebase).verifyIdToken(token);
        (req as any).user = {
          id: decoded.uid,
          email: decoded.email,
        };
        next();
        return;
      } catch {
        // Not a Firebase ID token (e.g. a local register/login JWT) — fall
        // through to local JWT verification below instead of hard-failing.
      }
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};