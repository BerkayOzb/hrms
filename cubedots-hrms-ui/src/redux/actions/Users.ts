import { Dispatch } from "react";
import { APIService } from "../../services/API";
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_DETAILS_SUCCESS,
  SELECT_USER,
} from "../constants/Users";

export const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

export const fetchUsersSuccess = (users: any) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: { users },
  };
};

export const fetchUsersFailure = (error: any) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: { error },
  };
};

export const selectUser = (userId: any) => {
  return {
    type: SELECT_USER,
    payload: { userId },
  };
};

export const fetchUserDetailsSuccess = (userId: string, userDetails: any) => {
  return {
    type: FETCH_USER_DETAILS_SUCCESS,
    payload: { userId, userDetails },
  };
};

export const fetchUsers = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch(fetchUsersRequest());
    return APIService.getUsers()
      .then((response) => {
        if (response.statusCode == "7000") {
          dispatch(fetchUsersSuccess(response.data.users));
        } else {
          dispatch(fetchUsersFailure(response.message));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

