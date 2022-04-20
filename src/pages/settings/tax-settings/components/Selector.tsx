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
import { SelectField } from '@invoiceninja/forms';
import axios from 'axios';
import { endpoint } from 'common/helpers';
import { useCompanyChanges } from 'common/hooks/useCompanyChanges';
import { TaxRate } from 'common/interfaces/tax-rate';
import { defaultHeaders } from 'common/queries/common/headers';
import { updateChanges } from 'common/stores/slices/company-users';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

export function Selector() {
  const [t] = useTranslation();
  const companyChanges = useCompanyChanges();
  const dispatch = useDispatch();

  const { data } = useQuery('/api/v1/tax_rates', () =>
    axios.get(endpoint('/api/v1/tax_rates'), { headers: defaultHeaders() })
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.options[event.target.selectedIndex];

    dispatch(
      updateChanges({
        object: 'company',
        property: event.target.id,
        value: option.dataset.rate,
      })
    );

    dispatch(
      updateChanges({
        object: 'company',
        property: option.dataset.rateName as string,
        value: event.target.value,
      })
    );
  };

  return (
    <>
      {companyChanges?.enabled_tax_rates > 0 && (
        <Card>
          {companyChanges?.enabled_tax_rates > 0 && (
            <Element leftSide={t('tax_rate1')}>
              <SelectField
                id="settings.tax_rate1"
                onChange={handleChange}
                value={companyChanges?.settings?.tax_name1 || '0'}
              >
                <option value="0"></option>
                {data &&
                  data.data.data.map((taxRate: TaxRate) => (
                    <option
                      data-rate={taxRate.rate}
                      data-rate-name="settings.tax_name1"
                      key={taxRate.id}
                      value={taxRate.name}
                    >
                      {taxRate.rate}% — {taxRate.name}
                    </option>
                  ))}
              </SelectField>
            </Element>
          )}

          {companyChanges?.enabled_tax_rates > 1 && (
            <Element leftSide={t('tax_rate2')}>
              <SelectField
                id="settings.tax_rate2"
                onChange={handleChange}
                value={companyChanges?.settings?.tax_name2 || '0'}
              >
                <option value="0"></option>
                {data &&
                  data.data.data.map((taxRate: TaxRate) => (
                    <option
                      data-rate={taxRate.rate}
                      data-rate-name="settings.tax_name2"
                      key={taxRate.id}
                      value={taxRate.name}
                    >
                      {taxRate.rate}% — {taxRate.name}
                    </option>
                  ))}
              </SelectField>
            </Element>
          )}

          {companyChanges?.enabled_tax_rates > 2 && (
            <Element leftSide={t('tax_rate3')}>
              <SelectField
                id="settings.tax_rate3"
                onChange={handleChange}
                value={companyChanges?.settings?.tax_name3 || '0'}
              >
                <option value="0"></option>
                {data &&
                  data.data.data.map((taxRate: TaxRate) => (
                    <option
                      data-rate={taxRate.rate}
                      data-rate-name="settings.tax_name3"
                      key={taxRate.id}
                      value={taxRate.name}
                    >
                      {taxRate.rate}% — {taxRate.name}
                    </option>
                  ))}
              </SelectField>
            </Element>
          )}
        </Card>
      )}
    </>
  );
}
