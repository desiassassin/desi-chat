import express from "express";
import { isUserAuthorized } from "../controller/middlewares.js";
import { fetchMessages, createUnread, removeUnread, updateNotificationsPreference } from "../controller/user.js";
export const apiV1Router = express.Router();

// Base Route : /api/v1

apiV1Router.use(isUserAuthorized);

apiV1Router.get("/conversation/:conversationId/messages", fetchMessages);
apiV1Router.route("/conversation/:conversationId/unread").post(createUnread).delete(removeUnread);
apiV1Router.route("/notifications-allowed").post(updateNotificationsPreference);