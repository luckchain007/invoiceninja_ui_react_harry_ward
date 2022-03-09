/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { clone } from 'lodash';
import { useEffect, useState } from 'react';

export function useTotalVariables() {
  const company = useCurrentCompany();
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    // We need to clone the product columns to local object,
    // because by default it's frozen.
    let variables: string[] =
      clone(company?.settings.pdf_variables.total_columns) || [];

    // In case we have `$line_taxes` or `$total_taxes` we want to remove them
    // if setting isn't enabled.

    const enabledTaxRates = company?.enabled_tax_rates || 0;

    if (enabledTaxRates <= 0) {
      variables = variables.filter((variable) => variable !== '$total_taxes');
      variables = variables.filter((variable) => variable !== '$line_taxes');
    }

    if (!company?.custom_fields?.surcharge1) {
      variables = variables.filter(
        (variable) => variable !== '$custom_surcharge1'
      );
    }

    if (!company?.custom_fields?.surcharge2) {
      variables = variables.filter(
        (variable) => variable !== '$custom_surcharge2'
      );
    }

    if (!company?.custom_fields?.surcharge3) {
      variables = variables.filter(
        (variable) => variable !== '$custom_surcharge3'
      );
    }

    if (!company?.custom_fields?.surcharge4) {
      variables = variables.filter(
        (variable) => variable !== '$custom_surcharge4'
      );
    }

    setColumns(variables);
  }, [company]);

  return columns;
}
