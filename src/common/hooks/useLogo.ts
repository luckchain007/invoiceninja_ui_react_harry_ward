/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import companySettings from 'common/constants/company-settings';
import { useCurrentCompany } from './useCurrentCompany';
import { useTranslation } from 'react-i18next';

export function useLogo() {
  const currentCompany = useCurrentCompany();

  return currentCompany?.settings?.company_logo || companySettings.logo;
}

export function useCompanyName() {
  const currentCompany = useCurrentCompany();
  const [t] = useTranslation();

  return currentCompany?.settings?.name || t('untitled_company');
}
