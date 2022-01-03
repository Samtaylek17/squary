import React, { FC, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, BrowserRouter, Outlet } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from './app/rootReducer';
import AuthContextProvider from './context/AuthContext';

// import Home from './pages';

const Home = lazy(() => import('./pages/Home'));
const Signup = lazy(() => import('./pages/Authentication/Signup'));
const Login = lazy(() => import('./pages/Authentication/Login'));
const PropertyPage = lazy(() => import('./pages/PropertyPage'));

const AppRoutes = () => {
  const styles = {
    margin: '20px 0',
    marginBottom: '20px',
    height: '100vh',
    padding: '20% 50%',
    TextAlign: 'center',
    borderRadius: '4px',
  };

  const Spinner = () => (
    <div style={styles}>
      <Spin size="large" />
    </div>
  );

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  // const useAuth()

  // type RouteProps = { element: LazyExoticComponent<FC<{}>>; exact: boolean; path: string; }

  const PrivateRoute: FC = () =>
    !isEmpty(user) && isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <AuthContextProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyPage />} />
            </Route>
            <Route
              path="/signup"
              element={isAuthenticated && !isEmpty(user) ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/login"
              element={isAuthenticated && !isEmpty(user) ? <Navigate to="/" /> : <Login />}
            />
          </Routes>
        </AuthContextProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
