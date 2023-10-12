import { Action } from "redux";
import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from "../constants/User";
import { OfficialDataFromDB } from "../../utils/formateOfficialDetails";

interface UserState {
  loading: boolean;
  user: OfficialDataFromDB;
  error: Error | null;
}

const initialState = {
  loading: false,
  user: {} as OfficialDataFromDB,
  error: null,
};
interface UserAction extends Action {
  payload?: any;
}

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.userData,
        error: null,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        user: {} as OfficialDataFromDB,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
