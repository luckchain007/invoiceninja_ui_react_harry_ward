/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { endpoint } from 'common/helpers';
import { useCompanyChanges } from 'common/hooks/useCompanyChanges';
import { updateRecord } from 'common/stores/slices/company-users';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { request } from 'common/helpers/request';
import { ValidationBag } from 'common/interfaces/validation-bag';

export function useHandleCompanySave(
  setErrors?: React.Dispatch<React.SetStateAction<ValidationBag | undefined>>
) {
  const [t] = useTranslation();
  const companyChanges = useCompanyChanges();
  const dispatch = useDispatch();

  return () => {
    const toastId = toast.loading(t('processing'));

    request(
      'PUT',
      endpoint('/api/v1/companies/:id', { id: companyChanges?.id }),
      companyChanges
    )
      .then((response) => {
        dispatch(updateRecord({ object: 'company', data: response.data.data }));

        toast.success(t('updated_settings'), { id: toastId });
      })
      .catch((error: AxiosError) => {
        console.error(error);

        toast.error(t('error_title'), { id: toastId });

        setErrors && setErrors(error.response?.data);
      });
  };
}
