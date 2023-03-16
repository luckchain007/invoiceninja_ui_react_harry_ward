/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useState, useEffect } from 'react';
import { clone } from 'lodash';

export function useProductColumns() {
  const company = useCurrentCompany();
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    // We need to clone the product columns to local object,
    // because by default it's frozen.
    let variables: string[] =
      clone(company?.settings.pdf_variables.product_columns) || [];

    // Local object is needed because we want to spread tax columns in case they're enabled.
    if (variables.includes('$product.tax')) {
      const taxes: string[] = [];
      const enabledTaxRates = company?.enabled_item_tax_rates || 0;

      if (enabledTaxRates > 0) {
        taxes.push('$product.tax_rate1');
      }

      if (enabledTaxRates > 1) {
        taxes.push('$product.tax_rate2');
      }

      if (enabledTaxRates > 2) {
        taxes.push('$product.tax_rate3');
      }

      // Let's remove original tax field because we don't need it anymore,
      // but first we gonna keep the index, because that's where we are injecting other input fields.
      const taxVariableIndex = variables.findIndex(
        (variable) => variable === '$product.tax'
      );

      variables.splice(taxVariableIndex + 1, 0, ...taxes);

      if (!company.enable_product_discount) {
        variables = variables.filter(
          (variable) => variable !== '$product.discount'
        );
      }

      variables = variables.filter((variable) => variable !== '$product.tax');
    }

    setColumns(variables);
  }, [company]);

  return columns;
}
