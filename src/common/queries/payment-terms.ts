/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import axios, { AxiosResponse } from 'axios';
import { endpoint, fetcher } from 'common/helpers';
import useSWR from 'swr';
import { defaultHeaders } from './common/headers';
import { Params } from './common/params.interface';

export function usePaymentTermsQuery(params: Params) {
  return useSWR(
    endpoint(
      '/api/v1/payment_terms?per_page=:perPage&page=:currentPage&sort=:sort&filter=:filter&status=:status',
      {
        perPage: params.perPage,
        currentPage: params.currentPage,
        sort: params.sort ?? 'id|asc',
        filter: params.filter,
        status: params.status,
      }
    ),
    fetcher
  );
}

export function bulk(id: string[], action: 'archive'): Promise<AxiosResponse> {
  return axios.post(
    endpoint('/api/v1/payment_terms/bulk'),
    {
      action,
      ids: id,
    },
    { headers: { ...defaultHeaders } }
  );
}
