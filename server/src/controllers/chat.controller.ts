import { Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import ChatConversation from "../models/chatConversation.model";
import { generateStylistReplyAI, StylistContext, stylistDiagnostics } from "../services/stylist.service";
import { asyncHandler } from "../utils/asyncHandler";

const currentUserId = (req: Request): string | undefined => (req as any).user?.id;

export const getStatus = (_req: Request, res: Response) => {
  res.json(stylistDiagnostics());
};

const bodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  context: z
    .object({
      analysisResult: z.any().optional(),
      wardrobeItems: z
        .array(
          z.object({
            name: z.string().max(120).optional(),
            category: z.string().max(60).optional(),
            palette: z.array(z.string().max(9)).max(12).optional(),
          })
        )
        .max(50)
        .optional(),
    })
    .optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(20)
    .optional(),
  conversationId: z.string().optional(),
});

export const postChat = asyncHandler(async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid chat request" });
    return;
  }
  const { message, context, history, conversationId } = parsed.data;
  const userId = currentUserId(req);

  // A conversationId that doesn't resolve to something this user owns fails
  // fast, before spending an AI call on a reply nothing will ever store.
  let existingId: mongoose.Types.ObjectId | undefined;
  if (conversationId) {
    if (!userId || !mongoose.isValidObjectId(conversationId)) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }
    const owned = await ChatConversation.exists({ _id: conversationId, userId });
    if (!owned) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }
    existingId = new mongoose.Types.ObjectId(conversationId);
  }

  const { reply, source } = await generateStylistReplyAI(
    message,
    context as StylistContext | undefined,
    history ?? [],
    { sessionId: userId ? `dstyle-${userId}` : undefined }
  );

  let savedConversationId: string | undefined;
  if (userId) {
    const id = existingId ?? new mongoose.Types.ObjectId();
    const conversation = await ChatConversation.findOneAndUpdate(
      { _id: id, userId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: message },
              { role: "assistant", content: reply },
            ],
            $slice: -200,
          },
        },
        $setOnInsert: { title: message.slice(0, 60) },
      },
      { upsert: true, new: true }
    );
    savedConversationId = String(conversation._id);
  }

  res.json({ success: true, reply, source, conversationId: savedConversationId });
});

export const listConversations = asyncHandler(async (req: Request, res: Response) => {
  const userId = currentUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Sign in required" });
    return;
  }
  const conversations = await ChatConversation.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(50)
    .select("title updatedAt messages")
    .lean();

  res.status(200).json({
    success: true,
    conversations: conversations.map((c) => ({
      id: String(c._id),
      title: c.title,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
    })),
  });
});

export const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const userId = currentUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Sign in required" });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  const conversation = await ChatConversation.findOne({ _id: req.params.id, userId }).lean();
  if (!conversation) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  res.status(200).json({
    success: true,
    conversation: {
      id: String(conversation._id),
      title: conversation.title,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    },
  });
});

export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
  const userId = currentUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Sign in required" });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  const deleted = await ChatConversation.findOneAndDelete({ _id: req.params.id, userId });
  if (!deleted) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  res.status(200).json({ success: true, message: "Conversation deleted" });
});
