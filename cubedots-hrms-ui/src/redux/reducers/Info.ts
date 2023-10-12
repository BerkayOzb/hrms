import {
  HIDE_ERROR,
  HIDE_MESSAGE,
  LOADING,
  NOT_LOADING,
  SHOW_ERROR,
  SHOW_MESSAGE,
} from "../constants/API";

const initState = {
  loading: false,
  message: "",
  showMessage: false,
  error: "",
  showError: false,
};

const infoReducer = (state = initState, action: { type: string, payload?: string }) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case NOT_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SHOW_ERROR:
      return {
        ...state,
        showError: true,
        error: action.payload,
        message:""
      };
    case HIDE_ERROR:
      return {
        ...state,
        showError: false,
        error: "",
      };
    case SHOW_MESSAGE:
      return {
        ...state,
        showMessage: true,
        message: action.payload,
        error:""
      };
    case HIDE_MESSAGE:{
      return {
        ...state,
        showMessage:false,
        message: ''
      }
    }

    default:
      return state;
  }
};

export default infoReducer;
