import * as ACTIONS from "./actions";

const initialState = {
     user: {},
};

export const user = (state = initialState.user, { type, payload }) => {
     switch (type) {
          case ACTIONS.USER.LOGGED_IN: {
               return { ...payload };
          }
          case ACTIONS.USER.LOGGED_OUT: {
               return {};
          }
          case ACTIONS.FRIENDS.REQUEST_SENT: {
               return { ...state, friendRequestsSent: [...state.friendRequestsSent, payload] };
          }
          case ACTIONS.FRIENDS.REQUEST_RECEIVED: {
               return { ...state, friendRequestsPending: [...state.friendRequestsPending, payload] };
          }
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED_BY_CURRENT_USER: {
               const friendRequestsPending = state.friendRequestsPending.filter((request) => request.username !== payload.acceptedUser);
               return { ...state, friendRequestsPending, friends: [...state.friends, { username: payload.acceptedUser, _id: payload._id }] };
          }
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED: {
               const friendRequestsSent = state.friendRequestsSent.filter((request) => request.username !== payload.acceptedByUser);
               return { ...state, friendRequestsSent, friends: [...state.friends, { username: payload.acceptedByUser, _id: payload._id }] };
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
          default:
               return false;
     }
};
