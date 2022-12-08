/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '@invoiceninja/cards';
import { useTranslation } from 'react-i18next';
import { Settings } from 'components/layouts/Settings';
import { InputField } from '@invoiceninja/forms';
import { useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { date, endpoint } from 'common/helpers';
import { useParams } from 'react-router-dom';
import { PasswordConfirmation } from 'components/PasswordConfirmation';
import { useApiTokenQuery } from 'common/queries/api-tokens';
import { useQueryClient } from 'react-query';
import { useCurrentCompanyDateFormats } from 'common/hooks/useCurrentCompanyDateFormats';
import { Archive } from './components/Archive';
import { Badge } from 'components/Badge';
import { Restore } from './components/Restore';
import { Delete } from './components/Delete';
import { useTitle } from 'common/hooks/useTitle';
import { request } from 'common/helpers/request';
import { route } from 'common/helpers/route';
import { ValidationBag } from 'common/interfaces/validation-bag';

export function Edit() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { data } = useApiTokenQuery({ id });

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('account_management'), href: '/settings/account_management' },
    { name: t('api_tokens'), href: '/settings/integrations/api_tokens' },
    {
      name: t('edit_token'),
      href: route('/settings/integrations/api_tokens/:id/edit', { id }),
    },
  ];

  useTitle('new_token');

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.data?.data.name || '',
    },
    onSubmit: (values) => {
      setErrors({});
      const toastId = toast.loading(t('processing'));

      request('PUT', endpoint('/api/v1/tokens/:id', { id }), values)
        .then(() => {
          toast.success(t('updated_token'), { id: toastId });
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            toast.dismiss();

            return setErrors(error.response.data);
          }

          error.response?.status === 412
            ? toast.error(t('password_error_incorrect'), { id: toastId })
            : toast.error(t('error_title'), { id: toastId });
        })
        .finally(() => {
          formik.setSubmitting(false);

          queryClient.invalidateQueries(route('/api/v1/tokens/:id', { id }));
        });
    },
  });

  return (
    <>
      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onClose={setIsPasswordConfirmModalOpen}
        onSave={() => formik.submitForm()}
      />

      <Settings title={t('new_token')} breadcrumbs={pages}>
        {data && (
          <Card
            disableSubmitButton={formik.isSubmitting}
            onFormSubmit={(event) => {
              event.preventDefault();
              setIsPasswordConfirmModalOpen(true);
            }}
            withSaveButton
            title={data?.data?.data.name}
          >
            <Element leftSide="Status">
              {!data.data.data.is_deleted && !data.data.data.archived_at && (
                <Badge variant="primary">{t('active')}</Badge>
              )}

              {data.data.data.archived_at && !data.data.data.is_deleted ? (
                <Badge variant="yellow">{t('archived')}</Badge>
              ) : null}

              {data.data.data.is_deleted && (
                <Badge variant="red">{t('deleted')}</Badge>
              )}
            </Element>

            <Element leftSide={t('name')}>
              <InputField
                required
                id="name"
                onChange={formik.handleChange}
                errorMessage={errors?.errors?.name}
                value={formik.values.name}
              />
            </Element>

            <Element leftSide={t('token')}>
              <p className="break-words">{data?.data?.data.token}</p>
            </Element>

            <Element leftSide={t('created_on')}>
              {date(data?.data?.data.created_at, dateFormat)}
            </Element>
          </Card>
        )}

        <Archive />
        <Restore />
        <Delete />
      </Settings>
    </>
  );
}
