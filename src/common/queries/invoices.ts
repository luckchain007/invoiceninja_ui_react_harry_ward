/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosResponse } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { Invoice } from '$app/common/interfaces/invoice';
import { useQuery } from 'react-query';
import { route } from '$app/common/helpers/route';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export interface GenericQueryOptions {
  enabled: boolean;
}

export function useInvoiceQuery(params: { id: string | undefined }) {
  return useQuery<Invoice>(
    route('/api/v1/invoices/:id', { id: params.id }),
    () =>
      request(
        'GET',
        endpoint('/api/v1/invoices/:id?include=client', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<Invoice>) => response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useBlankInvoiceQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery<Invoice>(
    route('/api/v1/invoices/create'),
    () =>
      request('GET', endpoint('/api/v1/invoices/create')).then(
        (response: GenericSingleResourceResponse<Invoice>) => response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_invoice'),
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete' | 'cancel'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/invoices/bulk'), {
    action,
    ids: Array.from(id),
  });
}
