import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { Form, Button, Spin, Input, message } from 'antd';
import styles from './Login.module.css';
import { RootState } from '../../../app/rootReducer';
import { login, fetchUser } from '../../../slices/authSlice';

const Login: FC = () => {
  const cx = classNames.bind(styles);
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const {
    isLoading: authLoading,
    isAuthenticated,
    error: authError,
  } = useSelector((state: RootState) => state.user);

  const handleSubmit = async () => {
    dispatch(login({ email, password }));
    // message.success('Login successful!', 5);
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
            <div className="col-md-7">
              <div className="container p-sm-5 py-5 px-0">
                <div className="row px-lg-5 mt-5">
                  <div className="col-md-10 mx-auto">
                    <p className="text-grey text-end d-sm-block d-none">
                      Don&#39;t have an account?{' '}
                      <a href="/signup" className="text-green text-decoration-none">
                        Sign up
                      </a>
                    </p>
                    <h2 className={`${cx({ header: true })} text-sm-start text-center`}>Login</h2>
                    <Spin delay={500} spinning={Boolean(authLoading)}>
                      <div className="row mt-5">
                        <Form
                          name="signup"
                          className="signup-form"
                          form={form}
                          onFinish={handleSubmit}
                          initialValues={{ remember: true }}
                          layout="vertical"
                        >
                          <Form.Item
                            name="email"
                            rules={[
                              { type: 'email', message: 'Please input a valid email!' },
                              { required: true, message: 'Please input your email!' },
                            ]}
                          >
                            <Input
                              placeholder="Email"
                              className={`${cx({ formInput: true })}`}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                          >
                            <Input.Password
                              placeholder="Password"
                              className={`${cx({ formInput: true })}`}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item>
                            <Button
                              disabled={Boolean(authLoading)}
                              className={`${cx({ submitBtn: true })}`}
                              htmlType="submit"
                            >
                              Sign In
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </Spin>
                    <p className="text-grey d-sm-none small">
                      Don&#39;t have an account?{' '}
                      <a href="/signup" className="text-green text-decoration-none">
                        Sign up
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

export default Login;
