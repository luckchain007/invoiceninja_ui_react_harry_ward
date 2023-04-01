/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { TaxRate } from '$app/common/interfaces/tax-rate';
import { Record } from '$app/components/forms/DebouncedCombobox';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolveTotalVariable } from '../hooks/useResolveTotalVariable';
import { useTotalVariables } from '../hooks/useTotalVariables';
import { CustomSurchargeField } from '$app/components/CustomSurchargeField';
import { TaxRateSelector } from '$app/components/tax-rates/TaxRateSelector';
import { InvoiceSum } from '$app/common/helpers/invoices/invoice-sum';
import { ProductTableResource, RelationType } from './ProductsTable';

interface Props {
  resource: ProductTableResource;
  invoiceSum?: InvoiceSum;
  relationType: RelationType;
  onChange: (property: keyof ProductTableResource, value: unknown) => unknown;
}

export function InvoiceTotals(props: Props) {
  const variables = useTotalVariables();
  const company = useCurrentCompany();
  const resource = props.resource;

  const resolveVariable = useResolveTotalVariable({
    resource,
    onChange: props.onChange,
    invoiceSum: props.invoiceSum,
    relationType: props.relationType,
  });

  const handleChange = (property: keyof ProductTableResource, value: unknown) =>
    props.onChange(property, value);

  const [currentTaxRateInput, setCurrentTaxRateInput] = useState(1);
  const [t] = useTranslation();

  return (
    <Card className="col-span-12 xl:col-span-4 h-max">
      {variables.map(
        (variable, index) =>
          (variable === '$subtotal' ||
            variable === '$paid_to_date' ||
            variable === '$taxes') && (
            <Fragment key={index}>{resolveVariable(variable)}</Fragment>
          )
      )}

      {company && company.enabled_tax_rates > 0 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            defaultValue={resource?.tax_rate1}
            clearButton={Boolean(resource?.tax_rate1)}
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
                `tax_name${currentTaxRateInput}` as keyof ProductTableResource,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof ProductTableResource,
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
            defaultValue={resource?.tax_rate2}
            clearButton={Boolean(resource?.tax_rate2)}
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
                `tax_name${currentTaxRateInput}` as keyof ProductTableResource,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof ProductTableResource,
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
            defaultValue={resource?.tax_rate3}
            clearButton={Boolean(resource?.tax_rate3)}
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
                `tax_name${currentTaxRateInput}` as keyof ProductTableResource,
                taxRate.name
              );

              handleChange(
                `tax_rate${currentTaxRateInput}` as keyof ProductTableResource,
                taxRate.rate
              );
            }}
            onInputFocus={() => setCurrentTaxRateInput(3)}
          />
        </Element>
      )}

      {variables.map(
        (variable, index) =>
          variable !== '$subtotal' &&
          variable !== '$paid_to_date' &&
          variable !== '$taxes' && (
            <Fragment key={index}>{resolveVariable(variable)}</Fragment>
          )
      )}

      {company && company?.custom_fields?.surcharge1 && (
        <CustomSurchargeField
          field="surcharge1"
          defaultValue={resource?.custom_surcharge1}
          value={resource?.custom_surcharge1.toString() || ''}
          onValueChange={(value) => handleChange('custom_surcharge1', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge2 && (
        <CustomSurchargeField
          field="surcharge2"
          defaultValue={resource?.custom_surcharge2}
          value={resource?.custom_surcharge2.toString() || ''}
          onValueChange={(value) => handleChange('custom_surcharge2', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge3 && (
        <CustomSurchargeField
          field="surcharge3"
          defaultValue={resource?.custom_surcharge3}
          value={resource?.custom_surcharge3.toString() || ''}
          onValueChange={(value) => handleChange('custom_surcharge3', value)}
        />
      )}

      {company && company?.custom_fields?.surcharge4 && (
        <CustomSurchargeField
          field="surcharge4"
          defaultValue={resource?.custom_surcharge4}
          value={resource?.custom_surcharge4.toString() || ''}
          onValueChange={(value) => handleChange('custom_surcharge4', value)}
        />
      )}
    </Card>
  );
}
