import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Spin, message } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Home.module.css';
import Header from '../../components/Header';
import { RootState } from '../../app/rootReducer';
import { addProperty, fetchMyProperties, emptyCurrentSurvey } from '../../slices/propertySlice';
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
            <div className="col-md-6 col-4">
              <button type="button" className={styles.addProperty} onClick={showModal}>
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
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input.TextArea
                        placeholder="Description"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button className={`${cx({ submitBtn: true })}`} htmlType="submit">
                        Add Property
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              </Modal>
            </div>
            <div className="col-md-6 text-end col-6">
              <button type="button" className={styles.addProperty}>
                <LinkOutlined className="align-middle" />
                Transfer Property
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h3 className="text-center mt-5">My Properties</h3>
          <div className="row mt-3">
            {propertyList.map((property) => (
              <div className="col-md-3 mt-3">
                <div className="card">
                  <div className="card-header">
                    <img src={Home1} className="img-fluid" alt="house" />
                  </div>
                  <div className="card-body">
                    <h4>{property.title}</h4>
                    <p>${property.price}</p>

                    <button
                      type="button"
                      className={styles.addProperty}
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
