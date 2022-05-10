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
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { useQuery } from 'react-query';
import { defaultHeaders } from './common/headers';
import { Params } from './common/params.interface';

export function useDocumentsQuery(params: Params) {
  return useQuery(['/api/v1/documents', params], () =>
    request(
      'GET',
      endpoint('/api/v1/documents?per_page=:perPage&page=:currentPage', {
        perPage: params.perPage,
        currentPage: params.currentPage,
      })
    )
  );
}
