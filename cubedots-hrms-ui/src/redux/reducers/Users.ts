import { Action } from "redux";
import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USER_DETAILS_SUCCESS,
  SELECT_USER,
} from "../constants/Users";
import { User } from "../../pages/adminPanel";

interface UsersState {
  loading: boolean;
  users: User[] | [];
  error: Error | null;
  selectedUser: string | null;
  userDetails: { [userId: string]: any };
  filters: any;
}

const initialState: UsersState = {
  loading: false,
  users: [],
  error: null,
  selectedUser: null,
  userDetails: {},
  filters: {},
};

interface UserAction extends Action {
  payload?: any;
}

export const usersReducer = (
  state: UsersState = initialState,
  action: UserAction
): UsersState => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        error: null,
      };

    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        users: [],
        error: action.payload.error,
      };

    case SELECT_USER:
      return {
        ...state,
        selectedUser: action.payload.userId,
      };

    case FETCH_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          [action.payload.userId]: action.payload.userDetails,
        },
      };

    default:
      return state;
  }
};

export default usersReducer;
