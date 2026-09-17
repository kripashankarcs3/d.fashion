import { Router } from "express";
import {
  getStatus,
  postChat,
  listConversations,
  getConversation,
  deleteConversation,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";
import { chatLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/status", chatLimiter, getStatus);
router.post("/", authenticate, chatLimiter, postChat);

router.get("/conversations", authenticate, listConversations);
router.get("/conversations/:id", authenticate, getConversation);
router.delete("/conversations/:id", authenticate, deleteConversation);

export default router;
