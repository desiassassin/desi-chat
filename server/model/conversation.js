import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
     {
          participants: [{ type: mongoose.Types.ObjectId, ref: "User", required: [true, "Participants are required"] }],
          isGroup: {
               type: Boolean,
               default: false,
          },
          groupName: {
               type: String,
               default: "",
          },
          messages: {
               type: Array,
               required: true,
               default: [],
          },
          lastMessage: {
               required: true,
               type: String,
               default: "",
          },
     },
     { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
