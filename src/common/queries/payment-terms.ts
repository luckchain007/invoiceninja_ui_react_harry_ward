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
import { useQuery } from 'react-query';
import useSWR from 'swr';
import { defaultHeaders } from './common/headers';
import { Params } from './common/params.interface';

export function usePaymentTermsQuery(params: Params) {
  return useQuery(['/api/v1/payment_terms', params], () =>
    axios.get(
      endpoint(
        '/api/v1/payment_terms?per_page=:perPage&page=:currentPage&sort=:sort',
        {
          perPage: params.perPage,
          currentPage: params.currentPage,
          sort: params.sort ?? 'id|asc',
        }
      ),
      { headers: defaultHeaders }
    )
  );
}

export function usePaymentTermQuery(params: { id: string | undefined }) {
  return useSWR(endpoint('/api/v1/payment_terms/:id', params), fetcher);
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore'
): Promise<AxiosResponse> {
  return axios.post(
    endpoint('/api/v1/payment_terms/bulk'),
    {
      action,
      ids: id,
    },
    { headers: { ...defaultHeaders } }
  );
}
