import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

export const authenticateTokenAndSendUserDetails = (req, res, next) => {
     const authHeader = req.headers?.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (token) {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
               if (err) return res.status(403).json({ message: "Invalid token." });
               const { _id } = user;
               const currentUser = await User.findById(_id)
                    .populate("friends friendRequestsSent friendRequestsPending blocked", "username status")
                    .populate({
                         path: "conversations",
                         populate: {
                              path: "participants",
                              model: "User",
                              select: "username",
                         },
                    });
               return res.json({
                    message: "Authenticated",
                    user: {
                         accessToken: token,
                         username: currentUser.username,
                         status: user.status,
                         _id: currentUser._id,
                         friends: currentUser.friends,
                         friendRequestsSent: currentUser.friendRequestsSent,
                         friendRequestsPending: currentUser.friendRequestsPending,
                         blocked: currentUser.blocked,
                         conversations: currentUser.conversations,
                         unread: currentUser.unread,
                    },
               });
          });
     } else next();
};

export const isUserAuthorized = (req, res, next) => {
     const authHeader = req.headers?.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) return res.status(401).json({ message: "Please login first." });
     else
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
               if (err) return res.status(403).json({ message: "Invalid token." });
               req.user = user;
               next();
          });
};
