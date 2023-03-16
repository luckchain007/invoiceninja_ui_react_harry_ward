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
import { toast } from '$app/common/helpers/toast/toast';
import { Quote } from '$app/common/interfaces/quote';
import { useQueryClient } from 'react-query';
import { route } from '$app/common/helpers/route';
import { useAtomValue } from 'jotai';
import { invalidationQueryAtom } from '$app/common/atoms/data-table';

export function useApprove() {
  const queryClient = useQueryClient();
  const invalidateQueryValue = useAtomValue(invalidationQueryAtom);

  return (quote: Quote) => {
    toast.processing();

    request(
      'PUT',
      endpoint('/api/v1/quotes/:id?approve=true', { id: quote.id }),
      quote
    )
      .then(() => {
        toast.success('approved_quote');

        queryClient.invalidateQueries(
          route('/api/v1/quotes/:id', { id: quote.id })
        );

        queryClient.invalidateQueries('/api/v1/quotes');

        invalidateQueryValue &&
          queryClient.invalidateQueries([invalidateQueryValue]);
      })
      .catch((error) => {
        toast.error();

        console.error(error);
      });
  };
}
