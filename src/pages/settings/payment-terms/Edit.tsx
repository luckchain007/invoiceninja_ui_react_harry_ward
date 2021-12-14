/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ActionCard, Card, CardContainer } from '@invoiceninja/cards';
import { Button, InputField } from '@invoiceninja/forms';
import axios, { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { PaymentTerm } from 'common/interfaces/payment-term';
import { defaultHeaders } from 'common/queries/common/headers';
import { usePaymentTermQuery } from 'common/queries/payment-terms';
import { Container } from 'components/Container';
import { Settings } from 'components/layouts/Settings';
import { Spinner } from 'components/Spinner';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';

export function Edit() {
  const [t] = useTranslation();

  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: ${t('payment_terms')}`;
  });

  const { id } = useParams();
  const { data } = usePaymentTermQuery({ id });
  const { mutate } = useSWRConfig();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      num_days: data?.data.data.num_days || 0,
    },
    onSubmit: (values: Partial<PaymentTerm>) => {
      toast.loading(t('processing'));

      axios
        .put(
          endpoint('/api/v1/payment_terms/:id', { id: data?.data.data.id }),
          values,
          { headers: defaultHeaders }
        )
        .then(() => {
          mutate(data?.request.responseURL);

          toast.dismiss();
          toast.success(t('updated_payment_term'));
        })
        .catch((error: AxiosError) => {
          console.error(error);

          toast.dismiss();
          toast.error(t('error_title'));
        })
        .finally(() => formik.setSubmitting(false));
    },
  });

  return (
    <Settings title={t('payment_terms')}>
      {!data && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {data && (
        <Container className="space-y-6">
          <Card
            withSaveButton
            disableSubmitButton={formik.isSubmitting}
            onFormSubmit={formik.handleSubmit}
            title={data.data.data.name}
          >
            <CardContainer>
              <InputField
                value={formik.values.num_days}
                type="number"
                id="num_days"
                label={t('number_of_days')}
                onChange={formik.handleChange}
              />
            </CardContainer>
          </Card>
        </Container>
      )}
    </Settings>
  );
}
