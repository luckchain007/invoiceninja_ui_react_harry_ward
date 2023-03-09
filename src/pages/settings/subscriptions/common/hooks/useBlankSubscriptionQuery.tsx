/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useQuery } from 'react-query';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { Subscription } from '$app/common/interfaces/subscription';
import { route } from '$app/common/helpers/route';

export function useBlankSubscriptionQuery() {
  return useQuery<Subscription>(
    '/api/v1/subscriptions/create',
    () =>
      request('GET', endpoint('/api/v1/subscriptions/create')).then(
        (response: GenericSingleResourceResponse<Subscription>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

interface SubscriptionParams {
  id: string | undefined;
}

export function useSubscriptionQuery(params: SubscriptionParams) {
  return useQuery<Subscription>(
    route('/api/v1/subscriptions/:id', { id: params.id }),
    () =>
      request(
        'GET',
        endpoint('/api/v1/subscriptions/:id', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<Subscription>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}
