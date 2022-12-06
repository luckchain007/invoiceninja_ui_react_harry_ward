/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { GenericSingleResourceResponse } from 'common/interfaces/generic-api-response';
import { Invoice } from 'common/interfaces/invoice';
import { Params } from 'common/queries/common/params.interface';
import { useQuery } from 'react-query';

interface InvoiceParams extends Params {
  clientStatus?: string;
  clientId?: string;
  withoutDeletedClients?: boolean;
  enabled?: boolean;
}

export function useInvoicesQuery(params: InvoiceParams) {
  return useQuery<Invoice[]>(
    ['/api/v1/invoices', params],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/invoices?client_status=:client_status&filter=:filter&client_id=:client_id&without_deleted_clients=:without_deleted_clients',
          {
            client_status: params.clientStatus ?? 'all',
            client_id: params.clientId ?? '',
            filter: params.filter ?? '',
            without_deleted_clients: params.withoutDeletedClients || true,
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<Invoice[]>) =>
          response.data.data
      ),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}
