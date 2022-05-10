/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import axios from 'axios';
import { request } from 'common/helpers/request';
import { Invoice } from 'common/interfaces/invoice';
import { defaultHeaders } from 'common/queries/common/headers';
import { useQueryClient } from 'react-query';
import { useGeneratePdfUrl } from './useGeneratePdfUrl';

export function useDownloadPdf() {
  const queryClient = useQueryClient();
  const url = useGeneratePdfUrl();

  return (invoice: Invoice) => {
    const downloadableUrl = url(invoice);

    if (downloadableUrl) {
      queryClient.fetchQuery(downloadableUrl, () =>
        request('GET', downloadableUrl, {}, { responseType: 'arraybuffer' })
          .then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');

            link.download = 'invoice.pdf';
            link.href = url;
            link.target = '_blank';

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
          })
          .catch((error) => console.error(error))
      );
    }
  };
}
