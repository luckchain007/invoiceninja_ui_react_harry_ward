/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
import { useTitle } from '$app/common/hooks/useTitle';
import { DataTable } from '$app/components/DataTable';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import {
  defaultColumns,
  useActions,
  useAllRecurringExpenseColumns,
  useRecurringExpenseColumns,
} from '../common/hooks';

export function RecurringExpenses() {
  useTitle('recurring_expenses');

  const [t] = useTranslation();

  const pages = [
    { name: t('recurring_expenses'), href: '/recurring_expenses' },
  ];

  const columns = useRecurringExpenseColumns();

  const actions = useActions();

  const recurringExpenseColumns = useAllRecurringExpenseColumns();

  return (
    <Default
      title={t('recurring_expenses')}
      breadcrumbs={pages}
      docsLink="docs/recurring-expenses"
    >
      <DataTable
        resource="recurring_expense"
        endpoint="/api/v1/recurring_expenses?include=client,vendor"
        columns={columns}
        bulkRoute="/api/v1/recurring_expenses/bulk"
        linkToCreate="/recurring_expenses/create"
        linkToEdit="/recurring_expenses/:id/edit"
        customActions={actions}
        withResourcefulActions
        leftSideChevrons={
          <DataTableColumnsPicker
            columns={recurringExpenseColumns as unknown as string[]}
            defaultColumns={defaultColumns}
            table="recurringExpense"
          />
        }
      />
    </Default>
  );
}
