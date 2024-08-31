import { REGISTERED_USERS } from "../server.js";

const registerNamespaceController = (socket) => {
     console.log(`[!] REGISTER [!] Someone is registering.`);

     socket.on("register-username-change", ({ username }) => {
          socket.emit("register-username-validated", { exists: REGISTERED_USERS.exists(username) });
     });
};

export default registerNamespaceController;
