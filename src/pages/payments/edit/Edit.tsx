/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '@invoiceninja/cards';
import { InputField, SelectField, Textarea } from '@invoiceninja/forms';
import axios, { AxiosError } from 'axios';
import paymentType from 'common/constants/payment-type';
import { endpoint } from 'common/helpers';
import { useConvertCurrencyToggle } from 'common/hooks/useConvertCurrancy';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { defaultHeaders } from 'common/queries/common/headers';
import { usePaymentQuery } from 'common/queries/payments';
import { useStaticsQuery } from 'common/queries/statics';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { Container } from 'components/Container';
import Toggle from 'components/forms/Toggle';
import { Default } from 'components/layouts/Default';
import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router-dom';

export function Edit() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { data: payment } = usePaymentQuery({ id });
  const [convertCurrency, setconvertCurrency] = useConvertCurrencyToggle({
    id,
  });

  const pages: BreadcrumRecord[] = [
    { name: t('payments'), href: '/payments' },
    {
      name: t('edit_payment'),
      href: generatePath('/payments/:id/edit', { id: id }),
    },
  ];

  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<ValidationBag>();
  const { data: statics } = useStaticsQuery();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      number: payment?.data.data.number || '',
      amount: payment?.data.data.amount || 0,
      date: payment?.data.data.date || '',
      type_id: payment?.data.data.type_id || '',
      transaction_reference: payment?.data.data.transaction_reference || '',
      private_notes: payment?.data.data.private_notes || '',
      exchange_currency_id: payment?.data.data.exchange_currency_id || '',
      exchange_rate: payment?.data.data.exchange_rate,
    },
    onSubmit: (values) => {
      const toastId = toast.loading(t('processing'));
      setErrors(undefined);
      axios
        .put(endpoint('/api/v1/payments/:id', { id }), values, {
          headers: defaultHeaders,
        })
        .then(() => {
          toast.success(t('updated_payment'), { id: toastId });
        })
        .catch((error: AxiosError) => {
          console.error(error);
          toast.error(t('error_title'), { id: toastId });
          if (error.response?.status === 422) {
            setErrors(error.response.data);
          }
        })
        .finally(() => {
          formik.setSubmitting(false);
          queryClient.invalidateQueries(
            generatePath('/api/v1/payments/:id', { id })
          );
        });
    },
  });

  const getExchangeRate = (fromCurrencyId: string, toCurrencyId: string) => {
    if (fromCurrencyId == null || toCurrencyId == null) {
      return 1;
    }
    const fromCurrency = statics?.data.currencies.find(
      (data: any) => data.id === payment?.data.data.currency_id
    );
    const toCurrency = statics?.data.currencies.find(
      (data: any) => data.id === toCurrencyId
    );
    const baseCurrency = statics?.data.currencies.find(
      (data: any) => data.id === '1'
    );

    if (fromCurrency == baseCurrency) {
      return toCurrency.exchange_rate;
    }

    if (toCurrency == baseCurrency) {
      return 1 / (fromCurrency?.exchange_rate ?? 1);
    }

    return toCurrency.exchange_rate * (1 / fromCurrency.exchange_rate);
  };

  return (
    <Default
      breadcrumbs={pages}
      title={t('edit_payment')}
      docsLink="docs/payments/"
    >
      <Container>
        <Card
          title={t('edit_payment')}
          disableSubmitButton={formik.isSubmitting}
          onFormSubmit={formik.handleSubmit}
          withSaveButton
        >
          <Element leftSide={t('payment_number')}>
            <InputField
              id="number"
              value={formik.values.number}
              onChange={formik.handleChange}
              errorMessage={errors?.errors.payment_amount}
            />
          </Element>
          <Element leftSide={t('payment_date')}>
            <InputField
              id="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
            />
          </Element>
          <Element leftSide={t('payment_type')}>
            <SelectField
              id="type_id"
              value={payment?.data.data.type_id}
              onChange={formik.handleChange}
            >
              <option value=""></option>
              {Object.entries(paymentType).map((value: any, index: any) => {
                return (
                  <option key={index} value={String(value[0])}>
                    {t(value[1])}
                  </option>
                );
              })}
            </SelectField>
          </Element>
          <Element leftSide={t('transaction_reference')}>
            <InputField
              id="transaction_reference"
              onChange={formik.handleChange}
              value={formik.values.transaction_reference}
            ></InputField>
          </Element>
          <Element leftSide={t('private_notes')}>
            <Textarea
              id="private_notes"
              value={formik.values.private_notes}
              onChange={formik.handleChange}
            />
          </Element>
          <Element leftSide={t('convert_currency')}>
            <Toggle
              checked={formik.values.exchange_currency_id}
              onChange={() => {
                setconvertCurrency(!convertCurrency);
                formik.setFieldValue('exchange_currency_id', '');
                formik.setFieldValue('exchange_rate', '');
              }}
            />
          </Element>
          {convertCurrency && (
            <>
              <Element leftSide={t('currency')}>
                <SelectField
                  value={payment?.data.data.exchange_currency_id}
                  onChange={(event: any) => {
                    formik.setFieldValue(
                      'exchange_rate',
                      getExchangeRate(
                        payment?.data.data.currency_id,
                        event.target.value
                      )
                    );
                    formik.setFieldValue(
                      'exchange_currency_id',
                      event.target.value
                    );
                  }}
                >
                  <option value=""></option>
                  {statics?.data.currencies.map((element: any, index: any) => {
                    return (
                      <option value={element.id} key={index}>
                        {element.name}
                      </option>
                    );
                  })}
                </SelectField>
              </Element>
              <Element leftSide={t('exchange_rate')}>
                <InputField
                  onChange={(event: any) => {
                    formik.setFieldValue('exchange_rate', event.target.valeu);
                  }}
                  value={formik.values.exchange_rate}
                />
              </Element>
              <Element leftSide={t('converted_amount')}>
                <InputField
                  value={formik.values.amount * formik.values.exchange_rate}
                />
              </Element>
            </>
          )}
        </Card>
      </Container>
    </Default>
  );
}
