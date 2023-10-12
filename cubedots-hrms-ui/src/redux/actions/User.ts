import { Dispatch } from "react";
import { APIService } from "../../services/API";
import { User } from "../../services/Type";
import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
} from "../constants/User";

export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (userData: User) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: { userData },
  };
};

export const fetchUserFailure = (error: any) => {
  return {
    type: FETCH_USER_FAILURE,
    payload: { error },
  };
};

export const fetchUser = (userId: string) => {
   return (dispatch: Dispatch<any>) => {
    dispatch(fetchUserRequest());
    return APIService.getUserDetails(userId)
      .then((response) => {
        if (response.statusCode == "7000") {
          dispatch(fetchUserSuccess(response.data.userDetails));
        } else {
          dispatch(fetchUserFailure(response.message));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(fetchUserFailure(error.message));
      });
  };
};
