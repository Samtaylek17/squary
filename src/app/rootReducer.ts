import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import propertiesReducer from '../slices/propertySlice';

const rootReducer = combineReducers({
  user: authReducer,
  properties: propertiesReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
