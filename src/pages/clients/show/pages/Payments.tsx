/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import paymentStatus from '$app/common/constants/payment-status';
import { date } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { StatusBadge } from '$app/components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { dataTableStaleTime } from './Invoices';
import { Payment } from '$app/common/interfaces/payment';

export function Payments() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const columns: DataTableColumns = [
    {
      id: 'number',
      label: t('number'),
      format: (value, resource) => (
        <Link to={route('/payments/:id/edit', { id: resource.id })}>
          {value}
        </Link>
      ),
    },
    {
      id: 'status_id',
      label: t('status'),
      format: (value) => <StatusBadge for={paymentStatus} code={value} />,
    },
    {
      id: 'transaction_reference',
      label: t('transaction_reference'),
      format: (value) => value.toString().toUpperCase(),
    },
    {
      id: 'date',
      label: t('date'),
      format: (value) => date(value, dateFormat),
    },
  ];

  return (
    <DataTable
      resource="payment"
      endpoint={route('/api/v1/payments?client_id=:id&sort=id|desc', { id })}
      columns={columns}
      withResourcefulActions
      bulkRoute="/api/v1/payments/bulk"
      linkToCreate={route('/payments/create?client=:id', { id: id })}
      showRestore={(resource: Payment) => !resource.is_deleted}
      staleTime={dataTableStaleTime}
    />
  );
}
