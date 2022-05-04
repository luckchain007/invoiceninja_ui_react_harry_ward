/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentInvoice } from 'common/hooks/useCurrentInvoice';
import { Invoice } from 'common/interfaces/invoice';
import { Product } from 'common/interfaces/product';
import { setCurrentInvoiceLineItem } from 'common/stores/slices/invoices/extra-reducers/set-current-invoice-line-item';
import { useDispatch } from 'react-redux';

export function useHandleProductChange() {
  const dispatch = useDispatch();
  const invoice = useCurrentInvoice() as Invoice;

  return (index: number, product: Product) => {
    const lineItem = { ...invoice.line_items[index] };

    lineItem.product_key = product.product_key;
    lineItem.quantity = product.quantity || 1;
    lineItem.cost = product.cost || 0;
    lineItem.notes = product.notes || '';

    lineItem.tax_name1 = product.tax_name1 || '';
    lineItem.tax_name2 = product.tax_name2 || '';
    lineItem.tax_name3 = product.tax_name3 || '';

    lineItem.tax_rate1 = product.tax_rate1 || 0;
    lineItem.tax_rate2 = product.tax_rate2 || 0;
    lineItem.tax_rate3 = product.tax_rate3 || 0;

    lineItem.custom_value1 = product.custom_value1 || '';
    lineItem.custom_value2 = product.custom_value2 || '';
    lineItem.custom_value3 = product.custom_value3 || '';
    lineItem.custom_value4 = product.custom_value4 || '';

    dispatch(
      setCurrentInvoiceLineItem({
        index,
        lineItem,
      })
    );
  };
}
