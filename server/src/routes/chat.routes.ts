import { Router } from "express";
import { generateStylistReply, StylistContext } from "../services/stylist.service";

const router = Router();

router.post("/", (req, res) => {
  const { message, context } = (req.body ?? {}) as {
    message?: string;
    context?: StylistContext;
  };

  const reply = generateStylistReply(message ?? "", context);
  res.json({ success: true, reply });
});

export default router;
