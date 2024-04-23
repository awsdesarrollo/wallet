import { combineReducers } from "redux";
import user from "./user";
import loading from "./loading";
import firebase from './firebase';
import chat from "./chat";
import waiting_modal from './waiting_modal';
import location from "./location";
import appointment from "./appointment";
import remember from "./remember";
import jwt from "./jwt";
import last_notification from "./last_notification";

export default combineReducers({
  user,
  loading,
  firebase,
  chat,
  waiting_modal,
  location,
  appointment,
  remember,
  jwt,
  last_notification,
});