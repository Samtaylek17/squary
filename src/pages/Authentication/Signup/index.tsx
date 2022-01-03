import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './Signup.module.css';
import { RootState } from '../../../app/rootReducer';
import { signup, fetchUser } from '../../../slices/authSlice';

const Signup: FC = () => {
  const cx = classNames.bind(styles);
  const [form] = Form.useForm();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading: authLoading,
    isAuthenticated,
    error: authError,
  } = useSelector((state: RootState) => state.user);

  const handleSubmit = async () => {
    dispatch(signup({ firstname, lastname, email, password }, navigate));
  };

  useEffect(() => {
    if (authError) {
      const errors: any = Object.entries(authError).map(([key, val]) => ({
        name: key,
        value: form.getFieldValue(key),
        errors: val,
      }));
      form.setFields(errors);
      errors.map((error: any) => <>{message.error(error.errors.toString(), 5)}</>);
    }
  }, [form, authError]);

  const shouldFetchUser = !authLoading && !authError && isAuthenticated;

  useEffect(() => {
    if (shouldFetchUser) {
      dispatch(fetchUser());
    }
  }, [dispatch, shouldFetchUser]);

  return (
    <>
      <main className={styles.viewHeight}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-7 col-12">
              <div className="container p-sm-5 py-5 px-0">
                <p className="text-grey text-end d-sm-block d-none">
                  Already have an account?{' '}
                  <a href="/login" className="text-green text-decoration-none">
                    Sign In
                  </a>
                </p>

                <div className="row px-lg-5 mt-5">
                  <div className="col-md-10 mx-auto">
                    <h2 className={`${cx({ header: true })} text-sm-start text-center`}>
                      Create an account
                    </h2>
                    <Spin delay={500} spinning={Boolean(authLoading)}>
                      <div className="row mt-5">
                        <Form
                          form={form}
                          name="signup"
                          className="signup-form"
                          layout="vertical"
                          initialValues={{ remember: true }}
                          onFinish={handleSubmit}
                        >
                          <Form.Item
                            name="firstname"
                            rules={[{ required: true, message: 'Please input your First Name!' }]}
                          >
                            <Input
                              placeholder="First Name"
                              className={`${cx({ formInput: true })}`}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item
                            name="lastname"
                            rules={[{ required: true, message: 'Please input your Last Name!' }]}
                          >
                            <Input
                              placeholder="Last Name"
                              className={`${cx({ formInput: true })}`}
                              onChange={(e) => setLastname(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            rules={[
                              { type: 'email', message: 'Please input a valid email!' },
                              { required: true, message: 'Please input your email!' },
                            ]}
                          >
                            <Input
                              placeholder="Email"
                              type="email"
                              className={`${cx({ formInput: true })}`}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            hasFeedback
                            rules={[
                              { required: true, message: 'Please input your password!' },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (
                                    value.match(/[0-9]/g) ||
                                    getFieldValue('password').match(/[0-9]/g) > 0
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error('Password must contain at least one digit')
                                  );
                                },
                              }),
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (value.length > 6 || getFieldValue('password').length > 6) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error('Password must contain at least 6 characters')
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                              className={`${cx({ formInput: true })}`}
                            />
                          </Form.Item>
                          <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                              { required: true, message: 'Please confirm your password!' },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }

                                  return Promise.reject(new Error('Passwords do not match!'));
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              placeholder="Comfirm Password"
                              className={`${cx({ formInput: true })}`}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              disabled={Boolean(authLoading)}
                              className={`${cx({ submitBtn: true })}`}
                              htmlType="submit"
                            >
                              Register
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </Spin>
                    <p className="text-grey small d-sm-none">
                      Already have an account?{' '}
                      <a href="/login" className="text-green text-decoration-none">
                        Login
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Signup;
