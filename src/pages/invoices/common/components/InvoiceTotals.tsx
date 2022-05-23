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
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useCurrentInvoice } from 'common/hooks/useCurrentInvoice';
import { Invoice } from 'common/interfaces/invoice';
import { TaxRate } from 'common/interfaces/tax-rate';
import { Record } from 'components/forms/DebouncedCombobox';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolveTotalVariable } from '../hooks/useResolveTotalVariable';
import { useSetCurrentInvoiceProperty } from '../hooks/useSetCurrentInvoiceProperty';
import { useTotalVariables } from '../hooks/useTotalVariables';
import { CustomSurchargeField } from 'components/CustomSurchargeField';
import { TaxRateSelector } from 'components/tax-rates/TaxRateSelector';

export function InvoiceTotals() {
  const variables = useTotalVariables();
  const company = useCurrentCompany();
  const invoice = useCurrentInvoice();

  const resolveVariable = useResolveTotalVariable();
  const handleChange = useSetCurrentInvoiceProperty();

  const [currentTaxRateInput, setCurrentTaxRateInput] = useState(1);
  const [t] = useTranslation();

  return (
    <Card className="col-span-12 xl:col-span-4 h-max">
      {variables.map((variable, index) => (
        <Fragment key={index}>{resolveVariable(variable)}</Fragment>
      ))}

      {company && company?.custom_fields?.surcharge1 && (
        <CustomSurchargeField
          field="surcharge1"
          defaultValue={invoice?.custom_surcharge1}
          value={invoice?.custom_surcharge1.toString() || ''}
          onChange={(value) => handleChange('custom_surcharge1', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge2 && (
        <CustomSurchargeField
          field="surcharge2"
          defaultValue={invoice?.custom_surcharge2}
          value={invoice?.custom_surcharge2.toString() || ''}
          onChange={(value) => handleChange('custom_surcharge2', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge3 && (
        <CustomSurchargeField
          field="surcharge3"
          defaultValue={invoice?.custom_surcharge3}
          value={invoice?.custom_surcharge3.toString() || ''}
          onChange={(value) => handleChange('custom_surcharge3', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge4 && (
        <CustomSurchargeField
          field="surcharge4"
          defaultValue={invoice?.custom_surcharge4}
          value={invoice?.custom_surcharge4.toString() || ''}
          onChange={(value) => handleChange('custom_surcharge4', value)}
        />
      )}

      {company && company.enabled_tax_rates > 0 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            defaultValue={invoice?.tax_rate1}
            clearButton={Boolean(invoice?.tax_rate1)}
            onChange={(value: Record<TaxRate>) => {
              handleChange('tax_name1', value.resource?.name);
              handleChange('tax_rate1', value.resource?.rate);
            }}
            onClearButtonClick={() => {
              handleChange('tax_name1', '');
              handleChange('tax_rate1', 0);
            }}
            onTaxCreated={(taxRate) => {
              handleChange(
                `tax_name${currentTaxRateInput}` as keyof Invoice,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof Invoice,
                taxRate.rate
              );
            }}
            onInputFocus={() => setCurrentTaxRateInput(1)}
          />
        </Element>
      )}

      {company && company.enabled_tax_rates > 1 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            defaultValue={invoice?.tax_rate2}
            clearButton={Boolean(invoice?.tax_rate2)}
            onChange={(value: Record<TaxRate>) => {
              handleChange('tax_name2', value.resource?.name);
              handleChange('tax_rate2', value.resource?.rate);
            }}
            onClearButtonClick={() => {
              handleChange('tax_name2', '');
              handleChange('tax_rate2', 0);
            }}
            onTaxCreated={(taxRate) => {
              handleChange(
                `tax_name${currentTaxRateInput}` as keyof Invoice,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof Invoice,
                taxRate.rate
              );
            }}
            onInputFocus={() => setCurrentTaxRateInput(2)}
          />
        </Element>
      )}

      {company && company.enabled_tax_rates > 2 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            defaultValue={invoice?.tax_rate3}
            clearButton={Boolean(invoice?.tax_rate3)}
            onChange={(value: Record<TaxRate>) => {
              handleChange('tax_name3', value.resource?.name);
              handleChange('tax_rate3', value.resource?.rate);
            }}
            onClearButtonClick={() => {
              handleChange('tax_name3', '');
              handleChange('tax_rate3', 0);
            }}
            onTaxCreated={(taxRate) => {
              handleChange(
                `tax_name${currentTaxRateInput}` as keyof Invoice,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof Invoice,
                taxRate.rate
              );
            }}
            onInputFocus={() => setCurrentTaxRateInput(3)}
          />
        </Element>
      )}
    </Card>
  );
}
