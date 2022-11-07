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
          default:
               return false;
     }
};
