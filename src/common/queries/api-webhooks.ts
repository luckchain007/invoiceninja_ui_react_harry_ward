/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import axios, { AxiosResponse } from 'axios';
import { endpoint } from 'common/helpers';
import { useQuery } from 'react-query';
import { generatePath } from 'react-router-dom';
import { defaultHeaders } from './common/headers';
import { Params } from './common/params.interface';

export function useApiWebhooksQuery(params: Params) {
  return useQuery(['/api/v1/webhooks', params], () =>
    axios.get(
      endpoint('/api/v1/webhooks?per_page=:perPage&page=:currentPage', {
        perPage: params.perPage,
        currentPage: params.currentPage,
      }),
      { headers: defaultHeaders() }
    )
  );
}

export function useApiWebhookQuery(params: { id: string | undefined }) {
  return useQuery(
    generatePath('/api/v1/webhooks/:id', { id: params.id }),
    () =>
      axios.get(endpoint('/api/v1/webhooks/:id', { id: params.id }), {
        headers: defaultHeaders(),
      }),
    { staleTime: Infinity }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return axios.post(
    endpoint('/api/v1/webhooks/bulk'),
    {
      action,
      ids: id,
    },
    { headers: { ...defaultHeaders() } }
  );
}
