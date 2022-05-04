/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { resolveKey } from 'pages/invoices/common/helpers/resolve-key';
import { useTranslation } from 'react-i18next';

export function useResolveTranslation() {
  const [t] = useTranslation();

  const aliases: Record<string, string> = {
    '$product.tax_rate1': t('tax_rate1'),
    '$product.tax_rate2': t('tax_rate2'),
    '$product.tax_rate3': t('tax_rate3'),
  };

  return (key: string, delimiter = '.') => {
    if (Object.prototype.hasOwnProperty.call(aliases, key)) {
      return aliases[key];
    }

    const { property } = resolveKey(key, delimiter);

    return property ? t(property) : t(key);
  };
}
