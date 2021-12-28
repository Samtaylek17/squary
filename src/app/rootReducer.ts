import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
