/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Number } from 'common/helpers/number';
import { useCurrentCompany } from '../useCurrentCompany';
import { useResolveCountry } from '../useResolveCountry';
import { useResolveCurrency } from '../useResolveCurrency';

export function useFormatMoney() {
  const resolveCountry = useResolveCountry();
  const resolveCurrency = useResolveCurrency();
  const company = useCurrentCompany();

  return (value: string | number, countryId: string, currencyId: string) => {
    const country = resolveCountry(countryId);
    const currency = resolveCurrency(currencyId);

    if (country && currency) {
      return Number.formatMoney(value, currency, country, {
        showCurrencyCode: company.settings.show_currency_code,
      });
    }

    return value;
  };
}
