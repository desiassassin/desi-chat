console.clear();
import { instrument } from "@socket.io/admin-ui";
import { compare } from "bcrypt";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { authenticateTokenAndSendUserDetails } from "./controller/middlewares.js";
import { User } from "./model/user.js";
import registerNamespaceController from "./socketNamespaces/register.js";
import userNamespaceController from "./socketNamespaces/user.js";
import path from "node:path";

const app = express();
const httpServer = createServer(app);
const CLIENT = {
     url: null,
     domain: null
}

// set the client's domain and sub-domain (if exists) so that httpOnly cookies can work
if(process.env.MODE === "production") {
     CLIENT.url = `https://${process.env.APP_NAME}.${process.env.DOMAIN}`;
     CLIENT.domain = process.env.DOMAIN;
} else if(process.env.MODE === "development") {
     const internalIP = networkInterfaces().Ethernet[1].address;

     CLIENT.url = `http://${internalIP}:3000}`;
     CLIENT.domain = internalIP;
}


const io = new Server(httpServer, {
    cors: {
        origin: `https://${process.env.APP_NAME}.${process.env.DOMAIN}` || "*",
        credentials: true
    }
});

instrument(io, {
    namespaceName: "/adminUI",
    mode: "development",
    auth: true,
    auth: {
         type: "basic",
         username: "admin",
         password: "$2b$10$Gw6MHmE9GRCUkMKHuN4Uwe9xq40t6KergyFRroOxyPUoLQkgCvc3C",
    },
});

// namespace creation
io.of("/register").on("connection", registerNamespaceController);
io.of("/users").on("connection", userNamespaceController);

// MODELS

// Connect to MongoDB Atlas
await (async () => {
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
import { apiV1Router } from "./routes/apiV1.js";

// MIDDLEWARES
app.use(
    express.json({
        limit: "50mb"
    })
);
app.use(
    express.urlencoded({
        limit: "50mb",
        parameterLimit: 100000,
        extended: false
    })
);
app.use(
    cors({
        origin: "*",
        credentials: true
    })
);
app.use("/api/v1", apiV1Router);
app.use("/", express.static("./socket-admin-ui"));

//======================== GLOBALS ========================
export const REGISTERED_USERS = {
     users: await (async function () {
          return (await User.find({}, "username")).reduce((accumulator, { username, _id }) => {
                         accumulator[username] = { _id: _id.toString() };
                         return accumulator;
                    }, {});
     })(),
     add: function ({ username, _id }) {
          this.users[username] = { _id };
          return this;
     },
     remove: function (username) {
          delete this.users[username];
          return this;
     },
     exists: function (username) {
          return this.users.hasOwnProperty(username);
     }
};

export const ONLINE_USERS = {
     users: {},
     add: function ({ username, socketId, _id }) {
          this.users[username] = { socketId, _id };
     },
     remove: function ({ socketId: socketIdToRemove }) {
          for (const [username, { socketId }] of Object.entries(this.users)) {
               if (socketId === socketIdToRemove) {
                    delete this.users[username];
                    break;
               }
          }
     },
     isOnline: function ({ username, socketId, _id }) {
          return this.users.hasOwnProperty(username);
     }
};

//================================================

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await new User({ username, password }).save();
        REGISTERED_USERS.add({ _id: user._id, username: user.username });
        return res.json({ message: "Registered" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error });
    }
});

app.post("/login", authenticateTokenAndSendUserDetails, async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        try {
            const user = await User.findOne({ username: username })
                .populate("friends friendRequestsSent friendRequestsPending blocked", "username status")
                .populate({
                    path: "conversations",
                    populate: {
                        path: "participants",
                        model: "User",
                        select: "username"
                    }
                });
            if (user) {
                return (await compare(password, user.password))
                    ? res.status(200).json({
                          message: "Authenticated",
                          user: {
                              username: user.username,
                              _id: user._id,
                              accessToken: jwt.sign({ _id: user._id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" }),
                              status: user.status,
                              friends: user.friends,
                              friendRequestsSent: user.friendRequestsSent,
                              friendRequestsPending: user.friendRequestsPending,
                              blocked: user.blocked,
                              conversations: user.conversations,
                              unread: user.unread
                          }
                      })
                    : res.status(400).json({ message: "Wrong password." });
            } else return res.status(400).json({ message: "Username does not exists." });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    } else return res.status(400).json({ message: "Please fill out all the fields." });
});

app.get("/adminUI", (req, res) => {
     res.sendFile(`${path.resolve()}/socket-admin-ui/index.html`);
})

httpServer.listen(3001, () => console.log("Server running on PORT 3001"));
