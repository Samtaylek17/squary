/* eslint-disable react/require-default-props */
import React, { FC, useMemo, useEffect, useState } from 'react';
import { Modal, Form, Input, Spin, Button } from 'antd';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './Property.module.css';
import { RootState } from '../../app/rootReducer';
import {
  editProperty,
  fetchMyProperties,
  fetchProperty,
  sampleProperty,
} from '../../slices/propertySlice';

interface PropertyModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  handleCancel: () => void;
  // handleSubmit: () => void;
  // title?: string;
  setTitle: (value: string) => void;
  // description?: string;
  setDescription: (value: string) => void;
  // price?: string;
  setPrice: (value: string) => void;
}

const PropertyModal = ({
  isModalVisible,
  setIsModalVisible,
  handleCancel,
  // handleSubmit,
  setTitle,
  setDescription,
  setPrice,
}: PropertyModalProps) => {
  const cx = classNames.bind(styles);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const {
    isLoading: propertyLoading,
    error: propertyError,
    propertyList,
    currentProperty,
  } = useSelector((state: RootState) => state.properties);

  const { id } = useParams<{ id: string }>();
  const getCurrentProperty = () => {
    const y = propertyList.find(({ propertyId }) => propertyId === id);
    return y;
  };

  const updatedProperty = useMemo(() => getCurrentProperty(), [propertyList]);

  const [title] = useState<string | undefined>(`${updatedProperty?.title}`);
  const [description] = useState<string | undefined>(`${updatedProperty?.description}`);
  const [price] = useState<string | undefined>(`${updatedProperty?.price}`);

  useEffect(() => {
    dispatch(fetchProperty(id as string));
    dispatch(fetchMyProperties());
  }, [dispatch, id]);

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

    // eslint-disable-next-line @typescript-eslint/no-shadow
    getCurrentProperty();

    form.setFieldsValue({
      title,
      description,
      price,
    });
  }, [form, getCurrentProperty, propertyError]);

  const handleSubmit = () => {
    dispatch(editProperty(id as string, { title, description, price }));
    setTimeout(() => {
      setIsModalVisible(false);
    }, 500);
  };

  return (
    <Modal title="Edit Property" visible={isModalVisible} onCancel={handleCancel} footer={[]}>
      <Spin delay={500} spinning={Boolean(propertyLoading)}>
        <Form
          form={form}
          name="add-property"
          preserve={false}
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
  );
};

export default PropertyModal;
