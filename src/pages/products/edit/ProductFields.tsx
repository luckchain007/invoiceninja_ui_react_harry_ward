/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '@invoiceninja/cards';
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { toast } from 'common/helpers/toast/toast';
import { useHandleCustomFieldChange } from 'common/hooks/useHandleCustomFieldChange';
import { useInjectCompanyChanges } from 'common/hooks/useInjectCompanyChanges';
import { useShouldDisableCustomFields } from 'common/hooks/useShouldDisableCustomFields';
import { updateRecord } from 'common/stores/slices/company-users';
import { CustomFieldsPlanAlert } from 'components/CustomFieldsPlanAlert';
import { Field } from 'pages/settings/custom-fields/components';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function ProductFields() {
  const [t] = useTranslation();

  const dispatch = useDispatch();

  const company = useInjectCompanyChanges();

  const handleCustomFieldChange = useHandleCustomFieldChange();

  const disabledCustomFields = useShouldDisableCustomFields();

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.processing();

    request(
      'PUT',
      endpoint('/api/v1/companies/:id', { id: company?.id }),
      company
    )
      .then((response) => {
        dispatch(
          updateRecord({ object: 'company', data: response?.data.data })
        );

        toast.success('updated_product');
      })
      .catch((error) => {
        console.error(error);
        toast.error();
      });
  };

  return (
    <>
      <CustomFieldsPlanAlert />

      <Card
        title={t('custom_fields')}
        withSaveButton
        onFormSubmit={onSave}
        disableSubmitButton={disabledCustomFields}
        disableWithoutIcon={disabledCustomFields}
      >
        {company &&
          ['product1', 'product2', 'product3', 'product4'].map((field) => (
            <Field
              key={field}
              initialValue={company.custom_fields[field]}
              field={field}
              placeholder={t('product_field')}
              onChange={(value) => handleCustomFieldChange(field, value)}
            />
          ))}
      </Card>
    </>
  );
}
