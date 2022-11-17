import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
     {
          author: {
               type: mongoose.Types.ObjectId,
               ref: "User",
               required: true,
          },
          content: {
               required: [true, "Content is required."],
               type: String,
               trim: true,
               minlength: [1, "Content is too short."],
               maxlenght: [2000, "Content is too long."],
          },
          conversation: {
               type: mongoose.Types.ObjectId,
               ref: "Conversation",
               required: true,
          },
     },
     { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
