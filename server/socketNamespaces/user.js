import { ONLINE_USERS, REGISTERED_USERS } from "../Globals.js";
import { User } from "../model/user.js";

const userNamespaceController = (socket) => {
     ONLINE_USERS.add({ username: socket.handshake.query.username, socketId: socket.id, id: socket.handshake.query.id });
     console.log(ONLINE_USERS.users);

     socket.on("disconnect", () => {
          ONLINE_USERS.remove({ socketId: socket.id });
          console.log(ONLINE_USERS.users);
     });

     socket.on("friend-request-initiated", async ({ username, usernameToAdd }) => {
          // 1
          const userExists = REGISTERED_USERS.exists(usernameToAdd);
          // 2
          if (!userExists) {
               socket.emit("friend-request-initiated-response", `${usernameToAdd} doesn't exists.`);
               return;
          } else if (username === usernameToAdd) {
               socket.emit("friend-request-initiated-response", `You can not add yourself.`);
               return;
          }
          // 3
          let currentUser = null;
          try {
               currentUser = await User.findById(REGISTERED_USERS.users[username].id).populate("friends friendRequestsSent friendRequestsPending blocked", "username");
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-initiated-response", "Something went wrong.");
               return;
          }

          // 4
          const inFriends = currentUser.friends.find((friend) => friend.username === usernameToAdd);
          const inFriendRequestsSent = currentUser.friendRequestsSent.find((request) => request.username === usernameToAdd);
          const inFriendRequestsPending = currentUser.friendRequestsPending.find((request) => request.username === usernameToAdd);
          const inBlocked = currentUser.blocked.find((user) => user.username === usernameToAdd);

          // 5
          if (inFriends || inFriendRequestsSent || inFriendRequestsPending || inBlocked) {
               let message = "";

               if (inFriends) message = `You and ${usernameToAdd} are already friends.`;
               else if (inFriendRequestsSent) message = `A friend request to ${usernameToAdd} has already been sent.`;
               else if (inFriendRequestsPending) message = `${usernameToAdd} has already sent you a friend request. Check your pending requests.`;
               else if (inBlocked) message = `You have blocked ${usernameToAdd}. Unblock them to send a friend request.`;

               socket.emit("friend-request-initiated-response", message);
               return;
          }

          const currentUserId = REGISTERED_USERS.users[username].id;
          const requestedUserId = REGISTERED_USERS.users[usernameToAdd].id;

          // 6
          try {
               // update sender
               await User.findByIdAndUpdate(currentUserId, { $push: { friendRequestsSent: requestedUserId } });
               // update receiver
               await User.findByIdAndUpdate(requestedUserId, { $push: { friendRequestsPending: currentUserId } });
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-initiated-response", "Something went wrong.");
               return;
          }

          // 7
          socket.emit("friend-request-sent", { _id: requestedUserId, username: usernameToAdd });

          // 8
          if (ONLINE_USERS.isOnline({ username: usernameToAdd })) {
               socket.to(ONLINE_USERS.users[usernameToAdd].socketId).emit("friend-request-received", { username, _id: currentUserId });
          }
     });

     socket.on("friend-request-accepted", ({ currentUser, _id, username }) => {
          console.log({ currentUser, _id, username });
     });

     socket.on("friend-request-rejected", ({ _id, username }) => {});

     socket.on("friend-request-cancelled", ({ _id, username }) => {});
};

export default userNamespaceController;
