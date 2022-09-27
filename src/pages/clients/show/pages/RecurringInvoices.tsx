/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '@invoiceninja/forms';
import frequency from 'common/constants/frequency';
import { date } from 'common/helpers';
import { route } from 'common/helpers/route';
import { useCurrentCompanyDateFormats } from 'common/hooks/useCurrentCompanyDateFormats';
import { RecurringInvoice } from 'common/interfaces/recurring-invoice';
import { DataTable, DataTableColumns } from 'components/DataTable';
import { StatusBadge } from 'components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function RecurringInvoices() {
  const [t] = useTranslation();
  const { id } = useParams();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const columns: DataTableColumns<RecurringInvoice> = [
    {
      id: 'frequency_id',
      label: t('frequency'),
      format: (value, recurringInvoice) => (
        <Link
          to={route('/recurring_invoices/:id/edit', {
            id: recurringInvoice.id,
          })}
        >
          <StatusBadge headless for={frequency} code={value} />
        </Link>
      ),
    },
    {
      id: 'number',
      label: t('number'),
      format: (value) => (value === '' ? t('pending') : value),
    },
    {
      id: 'amount',
      label: t('amount'),
    },
    {
      id: 'remaining_cycles',
      label: t('remaining_cycles'),
      format: (value) => (Number(value) < 0 ? t('endless') : value),
    },
    {
      id: 'next_send_date',
      label: t('next_send_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      id: 'auto_bill',
      label: t('auto_bill'),
      format: (value) => t(`${value}`),
    },
  ];

  return (
    <DataTable
      resource="recurring_invoice"
      endpoint={`/api/v1/recurring_invoices?client_id=${id}`}
      columns={columns}
      withResourcefulActions
      bulkRoute="/api/v1/recurring_invoices/bulk"
      linkToCreate={route('/recurring_invoices/create?client=:id', {
        id: id,
      })}
    />
  );
}
