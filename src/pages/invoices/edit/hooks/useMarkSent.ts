/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import axios from 'axios';
import { endpoint } from 'common/helpers';
import { Invoice } from 'common/interfaces/invoice';
import { defaultHeaders } from 'common/queries/common/headers';
import { setCurrentInvoice } from 'common/stores/slices/invoices/extra-reducers/set-current-invoice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function useMarkSent() {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  return (invoice: Invoice) => {
    const toastId = toast.loading(t('processing'));

    axios
      .put(
        endpoint('/api/v1/invoices/:id?mark_sent=true', { id: invoice.id }),
        invoice,
        { headers: defaultHeaders() }
      )
      .then((response) => {
        toast.success(t('notification_invoice_sent'), { id: toastId });

        dispatch(setCurrentInvoice(response.data.data));
      })
      .catch((error) => {
        toast.error(t('error_title'), { id: toastId });

        console.error(error);
      });
  };
}
