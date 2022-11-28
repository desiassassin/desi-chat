import express from "express";
import { isUserAuthorized } from "../controller/middlewares.js";
import { fetchMessages } from "../controller/user.js";
export const apiV1Router = express.Router();

// Base Route : /api/v1

apiV1Router.use(isUserAuthorized);

apiV1Router.get("/:conversationId/messages", fetchMessages);
