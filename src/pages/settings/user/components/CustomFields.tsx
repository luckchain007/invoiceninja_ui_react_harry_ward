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
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useHandleCustomFieldChange } from 'common/hooks/useHandleCustomFieldChange';
import { Field } from 'pages/settings/custom-fields/components';
import { useTranslation } from 'react-i18next';

export function CustomFields() {
  const [t] = useTranslation();

  const company = useCurrentCompany();

  const handleCustomFieldChange = useHandleCustomFieldChange();

  return (
    <Card title={t('custom_fields')}>
      {company &&
        ['user1', 'user2', 'user3', 'user4'].map((field) => (
          <Field
            key={field}
            initialValue={company.custom_fields[field]}
            field={field}
            placeholder={t('user_field')}
            onChange={(value: any) => handleCustomFieldChange(field, value)}
          />
        ))}
    </Card>
  );
}
