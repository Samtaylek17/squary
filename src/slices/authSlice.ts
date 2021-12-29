import { createSlice } from '@reduxjs/toolkit';
import { NavigateFunction, NavigateProps } from 'react-router-dom';
import checkAuth from '../helpers/checkAuth';
import app from '../firebase/base';

interface AuthInitialState {
  isAuthenticated: boolean;
  user: object | null;
  isLoading: boolean;
  error: object | null;
}

const authInitialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

function startLoading(state: AuthInitialState) {
  state.isLoading = true;
}

function loadingFailed(state: AuthInitialState, action: any) {
  state.isLoading = false;
  state.error = action.payload;
}

const auth = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginStart: startLoading,
    loginSuccess: (state: AuthInitialState) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    signupSuccess: (state: AuthInitialState) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: loadingFailed,
    logoutSuccess: (state: AuthInitialState) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    getUserSuccess(state: AuthInitialState, { payload }) {
      state.user = payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  signupSuccess,
  loginFailure,
  logoutSuccess,
  getUserSuccess,
} = auth.actions;

export default auth.reducer;

interface IAction {
  type: string;
  payload?: object;
}

export const logout = (navigate: any) => async (dispatch: (arg: IAction) => void) => {
  dispatch(loginStart());
  try {
    localStorage.removeItem('user');
    navigate.to('/login');
    dispatch(logoutSuccess());
  } catch (err: any) {
    dispatch(loginFailure(err.toString()));
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(loginStart());
  try {
    const user = await getUser();
    dispatch(getUserSuccess(user.data));
  } catch (err) {
    dispatch(loginFailure(err.toString()));
  }
};
