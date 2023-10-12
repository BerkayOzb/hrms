import {
  HIDE_ERROR,
  HIDE_MESSAGE,
  LOADING,
  NOT_LOADING,
  SHOW_ERROR,
  SHOW_MESSAGE,
} from "../constants/API";

export const loading = () => {
  return {
    type: LOADING,
  };
};

export const notLoading = () => {
  return {
    type: NOT_LOADING,
  };
};

export const showError = (message: string) => {
  return {
    type: SHOW_ERROR,
    payload: message,
  };
};

export const showMessage = (message: string) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const hideError = () => {
  return {
    type: HIDE_ERROR,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
