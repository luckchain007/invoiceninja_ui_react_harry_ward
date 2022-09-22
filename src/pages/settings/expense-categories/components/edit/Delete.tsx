/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ActionCard } from '@invoiceninja/cards';
import { Button } from '@invoiceninja/forms';
import { route } from 'common/helpers/route';
import {
  bulk,
  useExpenseCategoryQuery,
} from 'common/queries/expense-categories';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router-dom';

export function Delete() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { data } = useExpenseCategoryQuery({ id });
  const queryClient = useQueryClient();

  const destroy = () => {
    toast.loading(t('processing'));

    bulk([data?.data.data.id], 'delete')
      .then(() => {
        toast.dismiss();
        toast.success(t('deleted_expense_category'));
      })
      .catch((error) => {
        console.error(error);

        toast.dismiss();
        toast.success(t('error_title'));
      })
      .finally(() =>
        queryClient.invalidateQueries(
          route('/api/v1/expense_categories/:id', { id })
        )
      );
  };

  return (
    <>
      {data && !data.data.data.is_deleted && (
        <ActionCard label={t('delete')} help="">
          <Button onClick={destroy}>{t('delete')}</Button>
        </ActionCard>
      )}
    </>
  );
}
