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

     socket.on("friend-request-accept-initiated", async ({ currentUser, _id, acceptedUser }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser].id;
          const acceptedUserId = REGISTERED_USERS.users[acceptedUser].id;

          try {
               await User.findByIdAndUpdate(currentUserId, { $pull: { friendRequestsPending: acceptedUserId }, $push: { friends: acceptedUserId } });
               await User.findByIdAndUpdate(acceptedUserId, { $pull: { friendRequestsSent: currentUserId }, $push: { friends: currentUserId } });
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-accept-initiated-response", "Something went wrong");
               return;
          }

          socket.emit("friend-request-accept-success", { acceptedUser, _id });

          if (ONLINE_USERS.isOnline({ username: acceptedUser })) {
               socket.to(ONLINE_USERS.users[acceptedUser].socketId).emit("friend-request-accepted", { acceptedByUser: currentUser, _id: currentUserId });
          }
     });

     socket.on("friend-request-reject", async ({ currentUser, _id, rejectedOfUser }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser].id;
          const rejectedOfUserId = REGISTERED_USERS.users[rejectedOfUser].id;

          try {
               await User.findByIdAndUpdate(currentUserId, { $pull: { friendRequestsPending: rejectedOfUserId } });
               await User.findByIdAndUpdate(rejectedOfUserId, { $pull: { friendRequestsSent: currentUserId } });
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-reject-response", "Something went wrong");
               return;
          }

          socket.emit("friend-request-reject-success", { rejectedOfUser, _id });

          if (ONLINE_USERS.isOnline({ username: rejectedOfUser })) {
               socket.to(ONLINE_USERS.users[rejectedOfUser].socketId).emit("friend-request-rejected", { rejectedByUser: currentUser, _id: currentUserId });
          }
     });

     socket.on("friend-request-cancel", async ({ currentUser, _id, requestCancelledToUser }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser].id;
          const requestCancelledToUserId = REGISTERED_USERS.users[requestCancelledToUser].id;

          try {
               await User.findByIdAndUpdate(currentUserId, { $pull: { friendRequestsSent: requestCancelledToUserId } });
               await User.findByIdAndUpdate(requestCancelledToUserId, { $pull: { friendRequestsPending: currentUserId } });
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-cancel-response", "Something went wrong");
               return;
          }

          socket.emit("friend-request-cancel-success", { requestCancelledToUser, _id });

          if (ONLINE_USERS.isOnline({ username: requestCancelledToUser })) {
               socket.to(ONLINE_USERS.users[requestCancelledToUser].socketId).emit("friend-request-cancelled", { cancelledByUser: currentUser, _id: currentUserId });
          }
     });

     socket.on("friend-remove", async ({ currentUser, _id, userToRemove }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser].id;
          const userToRemoveId = REGISTERED_USERS.users[userToRemove].id;

          try {
               await User.findByIdAndUpdate(currentUserId, { $pull: { friends: userToRemoveId } });
               await User.findByIdAndUpdate(userToRemoveId, { $pull: { friends: currentUserId } });
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-remove-response", "Something went wrong");
               return;
          }

          socket.emit("friend-remove-success", { removedUser: userToRemove, _id });

          if (ONLINE_USERS.isOnline({ username: userToRemove })) {
               socket.to(ONLINE_USERS.users[userToRemove].socketId).emit("friend-removed", { removedByUser: currentUser, _id: currentUserId });
          }
     });
};

export default userNamespaceController;
