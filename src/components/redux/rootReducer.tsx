import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  // Add other reducers here
});

export default rootReducer;
