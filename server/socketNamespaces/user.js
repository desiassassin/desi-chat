import { ONLINE_USERS, REGISTERED_USERS } from "../Globals.js";
import { User } from "../model/user.js";

const userNamespaceController = (socket) => {
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
};

export default userNamespaceController;
