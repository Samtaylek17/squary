import { createSlice } from '@reduxjs/toolkit';
import checkAuth from '../helpers/checkAuth';
import app from '../firebase/base';
import { signupUser } from '../api/endpoints';

interface AuthInitialState {
  isAuthenticated: boolean;
  user: Record<string, unknown> | null;
  isLoading: boolean;
  error: Record<string, unknown> | null;
}

const authInitialState: AuthInitialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

function startLoading(state: AuthInitialState) {
  state.isLoading = true;
}

function loadingFailed(
  state: AuthInitialState,
  action: { payload: Record<string, unknown> | null }
) {
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
      state.error = null;
      state.isLoading = false;
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
  payload?: Record<string, unknown> | null;
}

interface NewUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export const signup =
  ({ firstname, lastname, email, password }: NewUser, navigate: any) =>
  async (dispatch: (arg: IAction) => void) => {
    dispatch(loginStart());
    try {
      const res = await app.auth().createUserWithEmailAndPassword(email, password);
      if (res.user) {
        const token = await res.user.getIdToken();
        await localStorage.setItem('token', token);

        await signupUser({
          firstname,
          lastname,
          email,
          password,
          userId: res.user.uid,
        });
        // const userData = {
        //   firstname,
        //   lastname,
        //   email,
        //   id: res.user.uid,
        //   createdAt: app.firestore.FieldValue.serverTimestamp(),
        // };
        // console.log(res.user);
        // await app.firestore().collection('/users').doc(res.user.uid).set(userData);
        // await res.user.updateProfile({ displayName: `${firstname} ${lastname}` });
        dispatch(signupSuccess());
        console.log('navigating away');
        navigate('/');
      }
    } catch (err: any) {
      let message = {};
      if (err.code === 'auth/email-already-in-use') {
        message = { email: [err.message] };
      }
      dispatch(loginFailure(message));
    }
  };

export const login =
  ({ email, password }: Partial<NewUser>) =>
  async (dispatch: (arg: IAction) => void) => {
    dispatch(loginStart());
    try {
      const res = await app.auth().signInWithEmailAndPassword(email as string, password as string);
      const token = await res.user?.getIdToken();

      checkAuth(token as string);

      localStorage.setItem('token', token as string);
      dispatch(loginSuccess());
    } catch (err) {
      const message = { email: ['wrong email or password'] };
      dispatch(loginFailure(message));
    }
  };

export const logout = () => async (dispatch: (arg: IAction) => void) => {
  dispatch(loginStart());
  try {
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
  } catch (err: any) {
    dispatch(loginFailure(err.toString()));
  }
};

export const fetchUser = () => async (dispatch: (arg: IAction) => void) => {
  dispatch(loginStart());
  try {
    const user = app.auth().currentUser?.providerData[0];
    dispatch(getUserSuccess(user));
  } catch (err: any) {
    dispatch(loginFailure(err.toString()));
  }
};
