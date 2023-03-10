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
import { route } from '$app/common/helpers/route';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';

export function useCompanyGatewaysQuery() {
  const { isAdmin } = useAdmin();

  return useQuery(
    route('/api/v1/company_gateways'),
    () => request('GET', endpoint('/api/v1/company_gateways')),
    { staleTime: Infinity, enabled: isAdmin }
  );
}

export function useCompanyGatewayQuery(params: { id: string | undefined }) {
  const { isAdmin } = useAdmin();

  return useQuery(
    route('/api/v1/company_gateways/:id', { id: params.id }),
    () =>
      request(
        'GET',
        endpoint('/api/v1/company_gateways/:id', { id: params.id })
      ),
    { staleTime: Infinity, enabled: isAdmin }
  );
}

export function useBlankCompanyGatewayQuery() {
  const { isAdmin } = useAdmin();

  return useQuery(
    route('/api/v1/company_gateways/create'),
    () => request('GET', endpoint('/api/v1/company_gateways/create')),
    { staleTime: Infinity, enabled: isAdmin }
  );
}
