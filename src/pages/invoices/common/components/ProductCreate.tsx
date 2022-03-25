/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button, InputField } from '@invoiceninja/forms';
import axios, { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useTitle } from 'common/hooks/useTitle';
import { defaultHeaders } from 'common/queries/common/headers';
import { useBlankProductQuery } from 'common/queries/products';
import { Container } from 'components/Container';
import { Modal } from 'components/Modal';
import { Element } from '@invoiceninja/cards';

import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Alert } from 'components/Alert';
import { CustomField } from 'components/CustomField';
import { CreateProductDto } from 'pages/products/common/components/CreateProduct';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen?: any;
}
export function ProductCreate(props: Props) {
  const [t] = useTranslation();
  const { data: product } = useBlankProductQuery();

  const company = useCurrentCompany();

  useTitle(t('new_product'));

  const [errors, setErrors] = useState<any>();

  const formik = useFormik({
    initialValues: {
      product_key: product?.data.data.product_key || '',
      notes: product?.data.datanotes || '',
      cost: product?.data.data.cost || '',
      quantity: product?.data.data.quantity || 1,
      custom_value1: product?.data.data.custom_value1 || '',
      custom_value2: product?.data.data.custom_value2 || '',
      custom_value3: product?.data.data.custom_value3 || '',
      custom_value4: product?.data.data.custom_value4 || '',
    },
    onSubmit: (values: CreateProductDto) => {
      axios
        .post(endpoint('/api/v1/products'), values, { headers: defaultHeaders })
        .then(() => {
          toast.success(t('created_product'));
          props.setIsModalOpen(!props.isModalOpen);
        })
        .catch((error: AxiosError) =>
          error.response?.status === 422
            ? setErrors(error.response.data.errors)
            : toast.error(t('error_title'))
        )
        .finally(() => formik.setSubmitting(false));
    },
  });

  return (
    <Modal
      title={t('new_product')}
      visible={props.isModalOpen}
      onClose={props.setIsModalOpen}
      backgroundColor="gray"
    >
      <Container>
        <Element leftSide={t('product')} required>
          <InputField
            id="product_key"
            value={formik.initialValues.product_key}
            required
            onChange={formik.handleChange}
          />
          {errors?.product_key && (
            <Alert type="danger">{errors.product_key}</Alert>
          )}
        </Element>
        <Element leftSide={t('notes')}>
          <InputField
            id="notes"
            element="textarea"
            value={formik.initialValues.notes}
            onChange={formik.handleChange}
          />
          {errors?.notes && <Alert type="danger">{errors.notes}</Alert>}
        </Element>
        <Element leftSide={t('cost')}>
          <InputField
            id="cost"
            value={formik.initialValues.cost}
            onChange={formik.handleChange}
          />
          {errors?.cost && <Alert type="danger">{errors.cost}</Alert>}
        </Element>
        <Element leftSide={t('quantity')}>
          <InputField
            id="quantity"
            value={formik.initialValues.quantity}
            onChange={formik.handleChange}
          />
        </Element>
        {company?.custom_fields?.product1 && (
          <CustomField
            field="custom_value1"
            defaultValue={formik.values.custom_value1}
            value={company.custom_fields.product1}
            onChange={(value) => formik.setFieldValue('custom_value1', value)}
          />
        )}

        {company?.custom_fields?.product2 && (
          <CustomField
            field="custom_value2"
            defaultValue={formik.values.custom_value2}
            value={company.custom_fields.product2}
            onChange={(value) => formik.setFieldValue('custom_value2', value)}
          />
        )}

        {company?.custom_fields?.product3 && (
          <CustomField
            field="custom_value3"
            defaultValue={formik.values.custom_value3}
            value={company.custom_fields.product3}
            onChange={(value) => formik.setFieldValue('custom_value3', value)}
          />
        )}

        {company?.custom_fields?.product4 && (
          <CustomField
            field="custom_value4"
            defaultValue={formik.values.custom_value4}
            value={company.custom_fields.product4}
            onChange={(value) => formik.setFieldValue('custom_value4', value)}
          />
        )}
      </Container>
      <Button
        type="primary"
        behavior="button"
        onClick={() => {
          formik.handleSubmit();
        }}
      >
        {t('save')}
      </Button>
    </Modal>
  );
}
