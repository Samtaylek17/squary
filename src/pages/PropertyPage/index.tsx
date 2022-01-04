import React, { FC, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './PropertyPage.module.css';
import House1 from '../Home/img/home1.jpeg';
import { RootState } from '../../app/rootReducer';
import {
  editProperty,
  fetchMyProperties,
  fetchProperty,
  transferAsset,
} from '../../slices/propertySlice';

const PropertyPage: FC = () => {
  const cx = classNames.bind(styles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading: propertyLoading,
    error: propertyError,
    propertyList,
    currentProperty,
  } = useSelector((state: RootState) => state.properties);

  const { id } = useParams<{ id: string }>();

  const getCurrentProperty = () => {
    // dispatch(fetchMyProperties());
    const y = propertyList.find(({ propertyId }) => propertyId === id);
    return y;
  };

  const updatedProperty = useMemo(() => getCurrentProperty(), [propertyList]);

  const [form] = Form.useForm();
  const [regTitle, setTitle] = useState<string | undefined>(`${updatedProperty?.title} `);
  const [regDescription, setDescription] = useState<string | undefined>(
    `${updatedProperty?.description}`
  );
  const [regPrice, setPrice] = useState<string | undefined>(`${updatedProperty?.price}`);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [transferModal, setTransferModal] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>('');

  useEffect(() => {
    dispatch(fetchProperty(id as string));
    dispatch(fetchMyProperties());
  }, []);

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
    getCurrentProperty();

    form.setFieldsValue({
      regTitle,
      regDescription,
      regPrice,
    });
  }, [form, getCurrentProperty, propertyError]);

  const handleSubmit = () => {
    dispatch(
      editProperty(id as string, { title: regTitle, description: regDescription, price: regPrice })
    );
    setTimeout(() => {
      setIsModalVisible(false);
    }, 500);
  };

  const handleTransfer = () => {
    dispatch(transferAsset(id as string, recipientEmail, navigate));
    setTimeout(() => {
      setTransferModal(false);
    }, 500);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showTransferModal = () => {
    setTransferModal(true);
  };

  const handleCancelModal = () => {
    setTransferModal(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Header />
      <section>
        <div className="container mt-5">
          <button type="button" className={styles.goback} onClick={() => navigate('/')}>
            Back
          </button>
          <div className="row g-sm-5">
            <div className="col-md-6">
              <img src={House1} alt="props-img" className="img-fluid w-100" />
            </div>
            <div className="col-md-6">
              <h3>{currentProperty?.title}</h3>
              <p>{currentProperty?.description}</p>
              <p>Price: ${currentProperty?.price}</p>
              <p>Owner: {currentProperty?.owner}</p>

              <button type="button" className={styles.updateBtn} onClick={showModal}>
                Update Property
              </button>
              <button type="button" className={styles.transferBtn} onClick={showTransferModal}>
                Transfer Asset
              </button>

              <Modal
                title="Edit Property"
                visible={isModalVisible}
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
                      name="regTitle"
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input
                        placeholder="Title"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="regPrice"
                      rules={[{ required: true, message: 'Title field cannot be blank' }]}
                    >
                      <Input
                        placeholder="Price"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="regDescription"
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

              <Modal
                title="Edit Property"
                visible={transferModal}
                onCancel={handleCancelModal}
                footer={[]}
              >
                <Spin delay={500} spinning={Boolean(propertyLoading)}>
                  <Form
                    form={form}
                    name="add-property"
                    className="add-property-form"
                    onFinish={handleTransfer}
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
                        type="email"
                        className={`${cx({ formInput: true })}`}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button className={`${cx({ submitBtn: true })}`} htmlType="submit">
                        Transfer
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              </Modal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PropertyPage;
