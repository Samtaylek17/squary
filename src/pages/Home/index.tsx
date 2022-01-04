import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { Steps } from 'intro.js-react';
import styles from './Home.module.css';
import Header from '../../components/Header';
import { RootState } from '../../app/rootReducer';
import { addProperty, fetchMyProperties } from '../../slices/propertySlice';
import Home1 from './img/home1.jpeg';

const Home: FC = () => {
  const cx = classNames.bind(styles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState('');
  const [steps] = useState([
    {
      element: '.addProperty',
      title: 'List Property',
      intro: 'Add a new property here',
      position: 'right',
      tooltipClass: 'mytooltip',
      highlightClass: 'myhighlight',
    },
    {
      element: '.view-property',
      title: 'View Property',
      intro: 'Click here to view details about each property',
      position: 'right',
      tooltipClass: 'mytooltip',
      highlightClass: 'myhighlight',
    },
    {
      element: '.logout',
      title: 'Logout',
      intro: 'Logout of the application',
      position: 'left',
      tooltipClass: 'mytooltip',
      highlightClass: 'myhighlight',
    },
  ]);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [initialStep] = useState(0);

  // Cookies
  const [cookies, setCookie] = useCookies(['appIntro']);
  const appIntroCookie = `squary-${new Date(Date.now()).toString()}`;

  const onExit = () => {
    setStepsEnabled(false);
    setCookie('appIntro', appIntroCookie, { path: '/' });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const {
    isLoading: propertyLoading,
    error: propertyError,
    propertyList,
  } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(fetchMyProperties());
    // dispatch(emptyCurrentSurvey());
  }, [dispatch]);

  useEffect(() => {
    if (propertyError) {
      const errors: any = Object.entries(propertyError).map(([key, val]) => ({
        name: key,
        value: form.getFieldValue(key),
        errors: val,
      }));
      form.setFields(errors);
      // errors.map((error: any) => <>{message.error(error.errors.toString())}</>);
    }
  }, [form, propertyError]);

  const handleSubmit = () => {
    dispatch(addProperty({ title, description, price }));
    setTimeout(() => {
      setIsModalVisible(false);
    }, 500);
  };

  const viewSingleProperty = (propertyId: string | undefined) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              {!cookies.appIntro && (
                <Steps
                  enabled={stepsEnabled}
                  steps={steps}
                  initialStep={initialStep}
                  onExit={onExit}
                  options={{ doneLabel: 'Done' }}
                />
              )}
              <button
                type="button"
                className={`${cx({ addProperty: true })} addProperty`}
                onClick={showModal}
              >
                <PlusOutlined className="align-middle" />
                Add Property
              </button>
              <Modal
                forceRender
                title="Add New Property"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
              >
                <Spin delay={500} spinning={Boolean(propertyLoading)}>
                  <Form
                    form={form}
                    name="add-property"
                    className="add-property-form"
                    onFinish={handleSubmit}
                    initialValues={{ remember: true }}
                    layout="vertical"
                  >
                    <Form.Item
                      name="title"
                      label="Title"
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input
                        placeholder="Title"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="price"
                      label="Price"
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input
                        placeholder="Price"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input.TextArea
                        placeholder="Description"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        disabled={Boolean(propertyLoading)}
                        className={`${cx({ submitBtn: true })}`}
                        htmlType="submit"
                      >
                        Add Property
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              </Modal>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h3 className="text-center mt-5">My Properties</h3>
          <div className="row mt-3">
            {propertyList.map((property) => (
              <div className="col-md-3 mt-3 d-flex align-self-stretched">
                <div className="card">
                  <div className="card-header">
                    <img src={Home1} className="img-fluid" alt="house" />
                  </div>
                  <div className="card-body">
                    <h4>{property.title}</h4>
                    <p>${property.price}</p>

                    <button
                      type="button"
                      className={`${cx({ addProperty: true })} view-property`}
                      onClick={() => viewSingleProperty(property.propertyId)}
                    >
                      <LinkOutlined className="align-middle" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
