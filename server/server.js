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

// MODELS
import { User } from "./model/user.js";

// Connect to MongoDB Atlas
(async () => {
     try {
          await mongoose.connect(process.env.DB_URL);
          console.log("Connected to MongoDB Atlas Cloud Database");
     } catch (error) {
          console.log(`Error connecting to MongoDB Atlas Cloud Database.\n${error.message}`);

          try {
               console.log("Attempting to connect to the Local Fallback Database.");
               await mongoose.connect(process.env.DB_URL_LOCAL);
               console.log("Connected to the Local Fallback Database.");
          } catch (error) {
               console.log(`Error connecting to the Local Fallback Database.\n${error.message}`);
               process.exit();
          }
     }
})();

// ROUTERS
import { userRouter } from "./routes/user.js";

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

app.post("/register", async (req, res) => {
     console.log(req.body);
     const { username, password } = req.body;
     try {
          await User.create({ username, password });
          return res.json({ message: "Registered" });
     } catch (error) {
          console.log(err.message);
          return res.status(400).json({ message: err });
     }
});

// socket io
io.on("connection", (socket) => {
     console.log(`New connection: ${socket.id}`);

     socket.on("register-username-change", ({ username }) => {
          console.log(username);
     });
});

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
