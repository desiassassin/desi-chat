import express from "express";
import { Message } from "../model/message.js";
import { isUserAuthorized } from "../controller/middlewares.js";
export const apiRouter = express.Router();

// Base Route : /api/v1

apiRouter.use(isUserAuthorized);

apiRouter.get("/:conversationId/messages", async (req, res) => {
     const { conversationId } = req.params;

     try {
          const messages = await Message.find({ conversation: conversationId });
          res.json({ messages });
     } catch (error) {
          res.json({ message: "Something went wrong." });
     }
});
