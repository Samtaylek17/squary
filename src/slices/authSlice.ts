import { createSlice } from '@reduxjs/toolkit';
// import checkAuth from '../helpers/checkAuth';
import firebase from '../firebase/base';
// import { loginUser, getUser } from '../api/endpoints';

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
  navigate?: any;
}

export const signup =
  ({ firstname, lastname, email, password, navigate }: NewUser) =>
  async (dispatch: (arg: IAction) => void) => {
    dispatch(loginStart());
    try {
      const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (res.user) {
        const userData = {
          firstname,
          lastname,
          email,
          id: res.user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await firebase.firestore().collection('/users').doc(res.user.uid).set(userData);
        await res.user.updateProfile({ displayName: `${firstname} ${lastname}` });
        dispatch(signupSuccess());
        navigate.to('/');
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
  ({ email, password, navigate }: Partial<NewUser>) =>
  async (dispatch: (arg: IAction) => void) => {
    dispatch(loginStart());
    try {
      const res = await firebase
        .auth()
        .signInWithEmailAndPassword(email as string, password as string);
      const token = await res.user?.getIdToken();

      // const user = checkAuth(token as string);
      // console.log(user);
      localStorage.setItem('token', token as string);
      dispatch(loginSuccess());
    } catch (err) {
      const message = { email: ['wrong email or password'] };
      dispatch(loginFailure(message));
    }
  };

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

export const fetchUser = () => async (dispatch: (arg: IAction) => void) => {
  dispatch(loginStart());
  try {
    const user = firebase.auth().currentUser?.providerData[0];
    dispatch(getUserSuccess(user));
  } catch (err: any) {
    dispatch(loginFailure(err.toString()));
  }
};
