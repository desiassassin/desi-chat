import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
     {
          participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
     },
     { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
