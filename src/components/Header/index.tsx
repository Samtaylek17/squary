import React, { FC } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Header.module.css';
import { RootState } from '../../app/rootReducer';
import { logout } from '../../slices/authSlice';

const Header: FC = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const cx = classNames.bind(styles);
  return (
    <>
      <nav
        className={`${cx({ navLight: true, navbarExpand: true })} navbar shadow navbar-expand-lg`}
      >
        <div className="container">
          <a href="/" className={`${cx({ navbarBrand: true })} navbar-brand`}>
            Squary
          </a>
          <button type="button" className={`${cx({ navbarToggler: true })} navbar-toggler`}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse">
            <ul className={`${cx({ navbarNav: true })} navbar-nav ms-auto`}>
              <li className="nav-item">
                <a className={`${cx({ navbarLink: true })} nav-link active`} href="/registrations">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className={`${cx({ navbarLink: true })} nav-link`} href="/documents">
                  About
                </a>
              </li>
              {isAuthenticated && user ? (
                <>
                  <li className="nav-item">
                    <button
                      className={`${cx({ navbarLink: true, signupBtn: true })} nav-link`}
                      type="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {' '}
                  <li className="nav-item">
                    <a
                      className={`${cx({ navbarLink: true, signupBtn: true })} nav-link`}
                      href="/signup"
                    >
                      Signup
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`${cx({ navbarLink: true, loginBtn: true })} nav-link`}
                      href="/login"
                    >
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
