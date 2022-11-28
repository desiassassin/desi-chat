import { Message } from "../model/message.js";
export const fetchMessages = async (req, res) => {
     const { conversationId } = req.params;

     try {
          const messages = await Message.find({ conversation: conversationId }).populate("author", "username");
          res.json({ messages });
     } catch (error) {
          res.json({ message: "Something went wrong." });
     }
};
