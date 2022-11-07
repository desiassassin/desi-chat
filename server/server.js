console.clear();
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { compare } from "bcrypt";
import { readFileSync, writeFileSync } from "fs";

const REGISTERED_NAMES = {
     names: JSON.parse(readFileSync("./data/registeredNames.json")),
     update: function () {
          writeFileSync("./data/registeredNames.json", JSON.stringify(this.names, null, 5));
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

app.post("/login", async (req, res) => {
     const { username, password } = req.body;

     if (username && password) {
          try {
               const user = await User.findOne({ username: username }, "username password");
               if (user) {
                    return (await compare(password, user.password))
                         ? res.status(200).json({
                                message: "Authenticated",
                                user: {
                                     id: user._id,
                                     accessToken: jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" }),
                                },
                           })
                         : res.status(400).json({ message: "Wrong password." });
               } else return res.status(400).json({ message: "Username does not exists." });
          } catch (error) {
               console.log(error.message);
               return res.status(500).json({ message: "Something went wrong. Please try again later." });
          }
     } else return res.status(400).json({ message: "Please fill out all the fields." });
});

// socket io
io.on("connection", (socket) => {
     socket.on("register-username-change", ({ username }) => {
          socket.emit("register-username-change", { exists: REGISTERED_NAMES.has(username) });
     });
});

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
