import * as ACTIONS from "./actions";

const initialState = {
     user: {},
};

export const user = (state = initialState.user, { type, payload }) => {
     switch (type) {
          case ACTIONS.USER.LOGGED_IN:
               return { ...payload };
          case ACTIONS.USER.LOGGED_OUT:
               return {};
          case ACTIONS.FRIENDS.REQUEST_SENT:
               return { ...state, friendRequestsSent: [...state.friendRequestsSent, payload] };
          case ACTIONS.FRIENDS.REQUEST_RECEIVED:
               return { ...state, friendRequestsPending: [...state.friendRequestsPending, payload] };
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED_CURRENT_USER:
               const friendRequestsPending = state.friendRequestsPending.filter((request) => request.username !== payload.acceptedUser);
               return { ...state, friendRequestsPending, friends: [...state.friends, { username: payload.acceptedUser, _id: payload._id }] };
          case ACTIONS.FRIENDS.REQUEST_ACCEPTED:
               const friendRequestsSent = state.friendRequestsSent.filter((request) => request.username !== payload.acceptedByUser);
               return { ...state, friendRequestsSent, friends: [...state.friends, { username: payload.acceptedByUser, _id: payload._id }] };
          default:
               return false;
     }
};
