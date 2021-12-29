import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';

const rootReducer = combineReducers({
  user: authReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
