/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from 'common/hooks/useTitle';
import { Page } from 'components/Breadcrumbs';
import { DataTable } from 'components/DataTable';
import { Default } from 'components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  usePaymentColumns,
} from '../common/hooks/usePaymentColumns';
import { DataTableColumnsPicker } from 'components/DataTableColumnsPicker';
import { useActions } from '../common/hooks/useActions';
import { usePaymentFilters } from '../common/hooks/usePaymentFilters';
import { useAllPaymentColumns } from '../common/hooks/useAllPaymentColumns';

export function Payments() {
  useTitle('payments');

  const [t] = useTranslation();

  const pages: Page[] = [{ name: t('payments'), href: '/payments' }];

  const columns = usePaymentColumns();

  const actions = useActions();

  const paymentColumns = useAllPaymentColumns();

  const filters = usePaymentFilters();

  return (
    <Default
      title={t('payments')}
      breadcrumbs={pages}
      docsLink="docs/payments/"
    >
      <DataTable
        resource="payment"
        columns={columns}
        endpoint="/api/v1/payments?include=client,invoices"
        linkToCreate="/payments/create"
        bulkRoute="/api/v1/payments/bulk"
        linkToEdit="/payments/:id/edit"
        withResourcefulActions
        customActions={actions}
        customFilters={filters}
        customFilterQueryKey="client_status"
        customFilterPlaceholder="status"
        leftSideChevrons={
          <DataTableColumnsPicker
            columns={paymentColumns as unknown as string[]}
            defaultColumns={defaultColumns}
            table="payment"
          />
        }
      />
    </Default>
  );
}
