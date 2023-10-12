import { combineReducers } from "redux";
import infoReducer from "./Info";
import usersReducer from "./Users";
import {userReducer} from "./User";


export const reducers = combineReducers({info:infoReducer, users:usersReducer , user: userReducer})