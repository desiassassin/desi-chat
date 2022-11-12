import { REGISTERED_USERS } from "../Globals.js";

const registerNamespaceController = (socket) => {
     socket.on("register-username-change", ({ username }) => {
          socket.emit("register-username-validated", { exists: REGISTERED_USERS.exists(username) });
     });
};

export default registerNamespaceController;
