console.clear();
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
     cors: {
          origin: ["https://admin.socket.io", "http://localhost:3000"],
          credentials: true,
     },
});

instrument(io, {
     auth: {
          type: "basic",
          username: "admin",
          password: "$2b$10$Gw6MHmE9GRCUkMKHuN4Uwe9xq40t6KergyFRroOxyPUoLQkgCvc3C",
     },
});

// MIDDLEWARES
app.use(
     express.json({
          limit: "50mb",
     })
);
app.use(
     express.urlencoded({
          limit: "50mb",
          parameterLimit: 100000,
          extended: false,
     })
);
app.use(
     cors({
          origin: "*",
          credentials: true,
     })
);

io.on("connection", () => {});

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
