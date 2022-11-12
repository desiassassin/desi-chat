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
          default:
               return false;
     }
};
