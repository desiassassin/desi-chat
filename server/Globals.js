import { readFileSync, writeFileSync } from "fs";

const filePath = "./data/registeredUsernames.json";

export const REGISTERED_USERS = {
     users: JSON.parse(readFileSync(filePath)),
     update: function () {
          writeFileSync(filePath, JSON.stringify(this.users, null, 5));
          return this;
     },
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
     },
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
     },
};
