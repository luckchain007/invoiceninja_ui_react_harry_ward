/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { Settings } from '$app/common/interfaces/company.interface';
import { updateChanges } from '$app/common/stores/slices/company-users';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function useInvoiceDesignTabs() {
  const [t] = useTranslation();

  const tabs: Tab[] = [
    {
      name: t('general_settings'),
      href: route('/settings/invoice_design'),
    },
    {
      name: t('total_fields'),
      href: route('/settings/invoice_design/total_fields'),
    },
    {
      name: t('client_details'),
      href: route('/settings/invoice_design/client_details'),
    },
    {
      name: t('company_details'),
      href: route('/settings/invoice_design/company_details'),
    },
    {
      name: t('company_address'),
      href: route('/settings/invoice_design/company_address'),
    },
    {
      name: t('invoice_details'),
      href: route('/settings/invoice_design/invoice_details'),
    },
    {
      name: t('quote_details'),
      href: route('/settings/invoice_design/quote_details'),
    },
    {
      name: t('credit_details'),
      href: route('/settings/invoice_design/credit_details'),
    },
    {
      name: t('vendor_details'),
      href: route('/settings/invoice_design/vendor_details'),
    },
    {
      name: t('purchase_order_details'),
      href: route('/settings/invoice_design/purchase_order_details'),
    },
    {
      name: t('product_columns'),
      href: route('/settings/invoice_design/product_columns'),
    },
    {
      name: t('task_columns'),
      href: route('/settings/invoice_design/task_columns'),
    },
  ];

  return tabs;
}

export function useHandleSettingsValueChange() {
  const dispatch = useDispatch();

  return <T extends keyof Settings, R extends Settings[T]>(
    property: T,
    value: R
  ) => {
    dispatch(
      updateChanges({
        object: 'company',
        property: `settings.${property}`,
        value,
      })
    );
  };
}
