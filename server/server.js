console.clear();
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { readFileSync, writeFileSync } from "fs";

const REGISTERED_NAMES = {
     names: readFileSync("./data/registeredNames.txt", { encoding: "utf-8" }).split(/\r\n|\n|\r/),
     update: function () {
          writeFileSync("./data/registeredNames.txt", this.names.join("\n"));
          return this;
     },
     add: function (name) {
          this.names.push(name);
          return this;
     },
     remove: function (names) {
          for (const name of names) {
               const index = this.names.indexOf(name);
               this.names.splice(index, 1);
          }
          return this;
     },
     has: function (name) {
          return this.names.includes(name);
     },
};

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
     const { username, password } = req.body;
     try {
          const user = await new User({ username, password }).save();
          // await ({ username, password });
          REGISTERED_NAMES.add(username).update();
          return res.json({ message: "Registered" });
     } catch (error) {
          console.log(error.message);
          return res.status(400).json({ message: error });
     }
});

// socket io
io.on("connection", (socket) => {
     socket.on("register-username-change", ({ username }) => {
          socket.emit("register-username-change", { message: REGISTERED_NAMES.has(username) ? `"${username}" is already taken. Please use another one.` : "" });
     });
});

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
