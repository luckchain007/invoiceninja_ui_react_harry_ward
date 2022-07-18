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
import { GenericManyResponse } from 'common/interfaces/generic-many-response';
import { Task } from 'common/interfaces/task';
import { useQuery } from 'react-query';
import { generatePath } from 'react-router-dom';

export function useTaskQuery(params: { id: string | undefined }) {
  return useQuery<Task>(
    generatePath('/api/v1/tasks/:id', { id: params.id }),
    () =>
      request('GET', endpoint('/api/v1/tasks/:id', { id: params.id })).then(
        (response) => response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useBlankTaskQuery() {
  return useQuery<Task>(generatePath('/api/v1/tasks/create'), () =>
    request('GET', endpoint('/api/v1/tasks/create')).then(
      (response) => response.data.data
    )
  );
}

export function useTasksQuery() {
  return useQuery<GenericManyResponse<Task>>(
    generatePath('/api/v1/tasks'),
    () =>
      request('GET', endpoint('/api/v1/tasks')).then(
        (response) => response.data
      )
  );
}
