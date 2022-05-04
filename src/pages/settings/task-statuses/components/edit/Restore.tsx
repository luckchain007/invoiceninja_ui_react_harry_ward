/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ActionCard } from '@invoiceninja/cards';
import { Button } from '@invoiceninja/forms';
import { bulk, useTaskStatusQuery } from 'common/queries/task-statuses';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router-dom';

export function Restore() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { data } = useTaskStatusQuery({ id });
  const queryClient = useQueryClient();

  const restore = () => {
    toast.loading(t('processing'));

    bulk([data?.data.data.id], 'restore')
      .then(() => {
        toast.dismiss();
        toast.success(t('restored_task_status'));
      })
      .catch((error) => {
        console.error(error);

        toast.dismiss();
        toast.success(t('error_title'));
      })
      .finally(() =>
        queryClient.invalidateQueries(
          generatePath('/api/v1/task_statuses/:id', { id })
        )
      );
  };

  return (
    <>
      {data && (data.data.data.archived_at || data.data.data.is_deleted) ? (
        <ActionCard label={t('restore')} help="">
          <Button onClick={restore}>{t('restore')}</Button>
        </ActionCard>
      ) : null}
    </>
  );
}
