import React, { FC, useState, FormEvent } from 'react';
import classNames from 'classnames/bind';
import { Menu, Dropdown, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { RootState } from '../../app/rootReducer';

const Header: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  console.log(user);

  const cx = classNames.bind(styles);
  return (
    <>
      <nav className={`${cx({ navLight: true, navbarExpand: true })} navbar navbar-expand-lg`}>
        <div className="container">
          <a href="/" className="navbar-brand">
            Squary
          </a>
          <button type="button" className={`${cx({ navbarToggler: true })} navbar-toggler`}>
            <span className="navbar-toggler-icon" />
          </button>
        </div>
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
            <li className="nav-item">
              <a className={`${cx({ navbarLink: true })} nav-link`} href="/Engage">
                Signup
              </a>
            </li>
            <li className="nav-item">
              <a className={`${cx({ navbarLink: true })} nav-link`} href="/resources">
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
