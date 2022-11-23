import { ONLINE_USERS, REGISTERED_USERS } from "../Globals.js";
import { User } from "../model/user.js";
import { Conversation } from "../model/conversation.js";
import { Message } from "../model/message.js";

const userNamespaceController = (socket) => {
     // change user's status to offline
     userLoggedIn(socket);

     socket.on("disconnect", async () => {
          const { username, _id } = socket.handshake.query;
          const socketId = socket.id;

          ONLINE_USERS.remove({ socketId });
          console.log(ONLINE_USERS.users);

          try {
               const user = await User.findByIdAndUpdate(_id, { status: "Offline" }, { returnDocument: true }).populate("friends", "username status");
               user.friends
                    .filter(({ status }) => status === "Online")
                    .forEach(({ username, _id }) => {
                         const socketId = ONLINE_USERS.users[username].socketId;
                         socket.to(socketId).emit("friend-went-offline", { friendWhoWentOffline: socket.handshake.query.username, _id: socket.handshake.query._id });
                    });
          } catch (error) {
               console.log(error.message);
          }
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
               currentUser = await User.findById(REGISTERED_USERS.users[username]._id).populate("friends friendRequestsSent friendRequestsPending blocked", "username");
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

          const currentUserId = REGISTERED_USERS.users[username]._id;
          const requestedUserId = REGISTERED_USERS.users[usernameToAdd]._id;

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

     socket.on("friend-request-accept", async ({ currentUser, _id, acceptedUser }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser]._id;
          const acceptedUserId = REGISTERED_USERS.users[acceptedUser]._id;

          try {
               // create a conversation
               let conversation = null;
               const existingConversation = await Conversation.findOne({ participants: { $all: [currentUserId, acceptedUserId], $size: 2 }, isGroup: false }).populate("participants", "username");

               if (!existingConversation) {
                    conversation = await (await new Conversation({ participants: [currentUserId, acceptedUserId] }).save()).populate("participants", "username");
               } else conversation = existingConversation;

               // remove the pending request and add to friends
               await User.findByIdAndUpdate(currentUserId, { $pull: { friendRequestsPending: acceptedUserId }, $addToSet: { friends: acceptedUserId, conversations: conversation._id } });
               // remove the sent request and add to friends
               await User.findByIdAndUpdate(acceptedUserId, { $pull: { friendRequestsSent: currentUserId }, $addToSet: { friends: currentUserId, conversations: conversation._id } });

               // emit event to both the users
               socket.emit("friend-request-accept-success", { acceptedUser, _id, newConversation: conversation, status: ONLINE_USERS.isOnline({ username: acceptedUser }) ? "Online" : "Offline" });

               if (ONLINE_USERS.isOnline({ username: acceptedUser })) {
                    socket.to(ONLINE_USERS.users[acceptedUser].socketId).emit("friend-request-accepted", { acceptedByUser: currentUser, _id: currentUserId, newConversation: conversation });
               }
          } catch (error) {
               console.log(error.message);
               socket.emit("friend-request-accept-response", "Something went wrong");
               return;
          }
     });

     socket.on("friend-request-reject", async ({ currentUser, _id, rejectedOfUser }) => {
          const currentUserId = REGISTERED_USERS.users[currentUser]._id;
          const rejectedOfUserId = REGISTERED_USERS.users[rejectedOfUser]._id;

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
          const currentUserId = REGISTERED_USERS.users[currentUser]._id;
          const requestCancelledToUserId = REGISTERED_USERS.users[requestCancelledToUser]._id;

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
          const currentUserId = REGISTERED_USERS.users[currentUser]._id;
          const userToRemoveId = REGISTERED_USERS.users[userToRemove]._id;

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

     socket.on("personal-message", async ({ content, messageTo, conversationId, _id }) => {
          const currentUserId = socket.handshake.query._id;
          // add the message to the database under the conversation id
          try {
               const message = await (await new Message({ author: currentUserId, content, conversation: conversationId }).save()).populate("author", "username");
               await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content });
               socket.emit("personal-message", { message });

               if (ONLINE_USERS.isOnline({ username: messageTo })) {
                    socket.to(ONLINE_USERS.users[messageTo].socketId).emit("personal-message", { message });
               }
          } catch (error) {
               console.log(error.message);
               socket.emit("personal-message-response", "Something went wrong.");
          }
     });
};

export default userNamespaceController;

async function userLoggedIn(socket) {
     const { username, _id } = socket.handshake.query;
     const socketId = socket.id;
     ONLINE_USERS.add({ username, socketId, _id });
     console.log(ONLINE_USERS.users);

     try {
          const user = await User.findByIdAndUpdate(_id, { status: "Online" }, { returnDocument: true }).populate("friends", "username status");
          user.friends
               .filter(({ status }) => status === "Online")
               .forEach(({ username, _id }) => {
                    const socketId = ONLINE_USERS.users[username].socketId;
                    socket.to(socketId).emit("friend-came-online", { friendWhoCameOnline: socket.handshake.query.username, _id: socket.handshake.query._id });
               });
     } catch (error) {
          console.log(error.message);
     }
}
