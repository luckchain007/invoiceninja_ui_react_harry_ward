/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { request } from 'common/helpers/request';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { endpoint } from '../../common/helpers';

export function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    request('POST', endpoint('/api/v1/logout'), {}).then(() => {
      localStorage.removeItem('X-NINJA-TOKEN');
      localStorage.removeItem('X-CURRENT-INDEX');

      queryClient.invalidateQueries();

      navigate('/');
    });
  });

  return <></>;
}
