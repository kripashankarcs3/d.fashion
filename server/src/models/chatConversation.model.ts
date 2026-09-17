import mongoose, { Schema, Document } from "mongoose";

export type ChatRole = "user" | "assistant";

export interface IChatMessage {
  role: ChatRole;
  content: string;
  createdAt: Date;
}

export interface IChatConversation extends Document {
  userId: string;
  /** Set once, from the first user message, when the conversation is
   *  created — never rewritten by later turns. */
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, _id: false }
);

const chatConversationSchema = new Schema<IChatConversation>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, maxlength: 120 },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

chatConversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model<IChatConversation>("ChatConversation", chatConversationSchema);
