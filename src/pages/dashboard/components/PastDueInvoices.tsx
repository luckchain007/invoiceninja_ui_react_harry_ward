/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date } from '$app/common/helpers';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { t } from 'i18next';
import { route } from '$app/common/helpers/route';
import { Link } from '$app/components/forms/Link';
import { Invoice } from '$app/common/interfaces/invoice';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Card } from '$app/components/cards';

export function PastDueInvoices() {
  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();
  const company = useCurrentCompany();

  const columns: DataTableColumns<Invoice> = [
    {
      id: 'number',
      label: t('number'),
      format: (value, invoice) => {
        return (
          <Link to={route('/invoices/:id/edit', { id: invoice.id })}>
            {invoice.number}
          </Link>
        );
      },
    },
    {
      id: 'client_id',
      label: t('client'),
      format: (value, invoice) => (
        <Link to={route('/clients/:id', { id: invoice.client_id })}>
          {invoice.client?.display_name}
        </Link>
      ),
    },
    {
      id: 'due_date',
      label: t('due_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      id: 'balance',
      label: t('balance'),
      format: (value, invoice) =>
        formatMoney(
          value,
          invoice.client?.country_id || company.settings.country_id,
          invoice.client?.settings.currency_id || company.settings.currency_id
        ),
    },
  ];

  return (
    <Card
      title={t('past_due_invoices')}
      className="h-96"
      padding="small"
      withScrollableBody
      withoutBodyPadding
    >
      <DataTable
        resource="invoice"
        columns={columns}
        endpoint="/api/v1/invoices?include=client&overdue=true&without_deleted_clients=true&per_page=50&page=1&sort=id|desc"
        withoutActions
        withoutPagination
        withoutPadding
      />
    </Card>
  );
}
