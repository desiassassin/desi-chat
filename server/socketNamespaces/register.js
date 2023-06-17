import { REGISTERED_USERS } from "../server.js";

const registerNamespaceController = (socket) => {
     socket.on("register-username-change", ({ username }) => {
          console.log({username, exists: REGISTERED_USERS.exists(username) })
          socket.emit("register-username-validated", { exists: REGISTERED_USERS.exists(username) });
     });
};

export default registerNamespaceController;
