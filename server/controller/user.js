import { Message } from "../model/message.js";
import { User } from "../model/user.js";
import {StatusCodes} from "http-status-codes"

export const fetchMessages = async (req, res) => {
     const { conversationId } = req.params;
     const {limit} = req.query;

     try {
          const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).limit(limit).populate("author", "username");
          res.json({ messages });
     } catch (error) {
          res.json({ message: "Something went wrong." });
     }
};

export const removeUnread = async (req, res) => {
     const { conversationId } = req.params;

     try {
          await User.findByIdAndUpdate(req.user._id, { $unset: { ["unread." + conversationId]: "" } });
          res.json({ message: "Removed unread messages.", conversationId });
     } catch (error) {
          console.log(error);
          res.json({ message: "Something went wrong." });
     }
};
export const createUnread = async (req, res) => {};

export const updateNotificationsPreference = async (req, res) => {
     try {
          await User.findByIdAndUpdate(req.user._id, { notificationsAllowed: true });
          res.sendStatus(StatusCodes.OK);
     } catch (error) {
          console.log(`Couldn't update notification preferences: ERR: ${error.message}`);
     }
}
