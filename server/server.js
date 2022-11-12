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
import { authenticateTokenAndSendUserDetails } from "./controller/middlewares.js";
import { User } from "./model/user.js";
import { REGISTERED_USERS, ONLINE_USERS } from "./Globals.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
     cors: {
          origin: "*",
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

// namespace creation
const registerNamespace = io.of("/register");
const userNamespace = io.of("/users");

// MODELS

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
          REGISTERED_USERS.add({ id: user._id, username: user.username }).update();
          return res.json({ message: "Registered" });
     } catch (error) {
          console.log(error.message);
          return res.status(400).json({ message: error });
     }
});

app.post("/login", authenticateTokenAndSendUserDetails, async (req, res) => {
     const { username, password } = req.body;

     if (username && password) {
          try {
               const user = await User.findOne({ username: username }).populate("friends friendRequestsSent friendRequestsPending blocked", "username");
               if (user) {
                    return (await compare(password, user.password))
                         ? res.status(200).json({
                                message: "Authenticated",
                                user: {
                                     username: user.username,
                                     id: user._id,
                                     accessToken: jwt.sign({ id: user._id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" }),
                                     friends: user.friends,
                                     friendRequestsSent: user.friendRequestsSent,
                                     friendRequestsPending: user.friendRequestsPending,
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

// register namespace
registerNamespace.on("connection", (socket) => {
     socket.on("register-username-change", ({ username }) => {
          socket.emit("register-username-validated", { exists: REGISTERED_USERS.exists(username) });
     });
});

userNamespace.on("connection", (socket) => {
     ONLINE_USERS.add({ username: socket.handshake.query.username, socketId: socket.id, id: socket.handshake.query.id });
     console.log(ONLINE_USERS.users);

     socket.on("disconnect", () => {
          ONLINE_USERS.remove({ socketId: socket.id });
          console.log(ONLINE_USERS.users);
     });

     socket.on("friend-request-try", async ({ username, usernameToAdd }) => {
          /*
               1a. Check if the user exists
               1b. If user exists, skip to Step 2.
               1c. Send a message saying user doesn't exists
               2a. Add the friend request in the friendRequests part of the requested user
               2b. Notify the requested user

               friend-request-try
               friend-request-try-response : currentUser
               friend-request-sent : currentUser
               friend-request-recieved : requestedUser
               friend-request-accepted: currentUser
          */
          const userExists = REGISTERED_USERS.exists(usernameToAdd);

          if (!userExists) {
               socket.emit("friend-request-try-response", `${usernameToAdd} doesn't exists. Maybe there's a typo?`);
               return;
          }

          const currentUserId = REGISTERED_USERS.users[username].id;
          const requestedUserId = REGISTERED_USERS.users[usernameToAdd].id;
          // user exists
          try {
               // update sender
               await User.findByIdAndUpdate(currentUserId, { $push: { friendRequestsSent: requestedUserId } });
               // update receiver
               await User.findByIdAndUpdate(requestedUserId, { $push: { friendRequestsPending: currentUserId } });

               // socket responses
               socket.emit("friend-request-sent");
               if (ONLINE_USERS.isOnline({ usernameToAdd })) socket.emit("friend-request-recieved");
          } catch (error) {
               console.log(error.message);
          }

          console.log(usernameToAdd);
          console.log(ONLINE_USERS.isOnline({ username: usernameToAdd }));
     });
});

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
