import React, { FC, createContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import firebase from 'firebase/compat/app';
import { fetchUser, logout } from '../slices/authSlice';
import app from '../firebase/base';
import { RootState } from '../app/rootReducer';

type AuthContextType = {
  currentUser: firebase.User | null;
  pending: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider: FC = (props: any): React.ReactElement<typeof AuthContext> => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [pending, setPending] = useState(true);
  const shouldFetchUser = isEmpty(user) && isAuthenticated;
  const appHasUser = !isEmpty(user) && isAuthenticated;

  useEffect(() => {
    if (shouldFetchUser) {
      dispatch(fetchUser());
    }
  }, [dispatch, shouldFetchUser]);

  useEffect(() => {
    return app.auth().onAuthStateChanged(async (theUser) => {
      setCurrentUser(theUser);
      setPending(false);
      if (!theUser && appHasUser) {
        localStorage.removeItem('token');
        dispatch(logout(navigate));
      }
    });
  }, [appHasUser, dispatch]);

  return (
    <AuthContext.Provider value={{ currentUser, pending }}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
