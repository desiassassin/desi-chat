import * as ACTIONS from "./actions";

const initialState = {
     user: {
          _id: "",
          usernme: "",
          friends: [],
          friendRequestsPending: [],
          friendRequestsSent: [],
          blocked: [],
          conversations: [],
     },
};

export const user = (state = initialState.user, { type, payload }) => {
     switch (type) {
          case ACTIONS.USER.LOGGED_IN: {
               return { ...payload };
          }
          case ACTIONS.USER.LOGGED_OUT: {
               return { ...initialState.user };
          }
          case ACTIONS.FRIENDS.REQUEST_SENT: {
               return { ...state, friendRequestsSent: [...state.friendRequestsSent, payload] };
          }
          case ACTIONS.FRIENDS.REQUEST_RECEIVED: {
               return { ...state, friendRequestsPending: [...state.friendRequestsPending, payload] };
          }
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED_BY_CURRENT_USER: {
               const friendRequestsPending = state.friendRequestsPending.filter((request) => request.username !== payload.acceptedUser);
               return { ...state, friendRequestsPending, friends: [...state.friends, { username: payload.acceptedUser, _id: payload._id, status: payload.status }] };
          }
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED: {
               const friendRequestsSent = state.friendRequestsSent.filter((request) => request.username !== payload.acceptedByUser);
               return { ...state, friendRequestsSent, friends: [...state.friends, { username: payload.acceptedByUser, _id: payload._id, status: "Online" }] };
          }
          case ACTIONS.FRIENDS.REQUEST_REJECTED_BY_CURRENT_USER: {
               const friendRequestsPending = state.friendRequestsPending.filter((request) => request.username !== payload.rejectedOfUser);
               return { ...state, friendRequestsPending };
          }
          case ACTIONS.FRIENDS.REQUEST_REJECTED: {
               const friendRequestsSent = state.friendRequestsSent.filter((request) => request.username !== payload.rejectedByUser);
               return { ...state, friendRequestsSent };
          }
          case ACTIONS.FRIENDS.REQUEST_CANCELLED_BY_CURRENT_USER: {
               const friendRequestsSent = state.friendRequestsSent.filter((request) => request.username !== payload.requestCancelledToUser);
               return { ...state, friendRequestsSent };
          }
          case ACTIONS.FRIENDS.REQUEST_CANCELLED: {
               const friendRequestsPending = state.friendRequestsPending.filter((request) => request.username !== payload.cancelledByUser);
               return { ...state, friendRequestsPending };
          }
          case ACTIONS.FRIENDS.UNFRIEND_BY_CURRENT_USER: {
               const friends = state.friends.filter((friend) => friend.username !== payload.removedUser);
               return { ...state, friends };
          }
          case ACTIONS.FRIENDS.UNFRIEND: {
               const friends = state.friends.filter((friend) => friend.username !== payload.removedByUser);
               return { ...state, friends };
          }
          case ACTIONS.FRIENDS.CAME_ONLINE: {
               const { friendWhoCameOnline, _id } = payload;
               const friends = state.friends.filter((friend) => friend.username !== friendWhoCameOnline);
               friends.push({ username: friendWhoCameOnline, _id, status: "Online" });
               return { ...state, friends };
          }
          case ACTIONS.FRIENDS.WENT_OFFLINE: {
               const { friendWhoWentOffline, _id } = payload;
               const friends = state.friends.filter((friend) => friend.username !== friendWhoWentOffline);
               friends.push({ username: friendWhoWentOffline, _id, status: "Offline" });
               return { ...state, friends };
          }
          case ACTIONS.FRIENDS.CONVERSATION_CREATED: {
               const conversationAlreadyExists = state.conversations.find((conversation) => conversation._id === payload.newConversation._id);
               if (conversationAlreadyExists) return state;
               return { ...state, conversations: [...state.conversations, payload.newConversation] };
          }
          case ACTIONS.FRIENDS.PERSONAL_MESSAGE: {
               const currentConversation = state.conversations.find((conversation) => conversation._id === payload.message.conversation);
               const conversations = state.conversations.filter((conversation) => conversation._id !== payload.message.conversation);
               currentConversation.messages.push(payload.message);
               currentConversation.lastMessage = payload.message.content;
               return { ...state, conversations: [currentConversation, ...conversations] };
          }
          default:
               return state;
     }
};
