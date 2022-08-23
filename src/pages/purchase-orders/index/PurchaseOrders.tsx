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
import purchaseOrderStatus from 'common/constants/purchase-order-status';
import { date } from 'common/helpers';
import { useFormatMoney } from 'common/hooks/money/useFormatMoney';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useCurrentCompanyDateFormats } from 'common/hooks/useCurrentCompanyDateFormats';
import { useTitle } from 'common/hooks/useTitle';
import { PurchaseOrder } from 'common/interfaces/purchase-order';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { DataTable, DataTableColumns } from 'components/DataTable';
import { Default } from 'components/layouts/Default';
import { StatusBadge } from 'components/StatusBadge';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

export function PurchaseOrders() {
  const { documentTitle } = useTitle('purchase_orders');

  const [t] = useTranslation();

  const pages: BreadcrumRecord[] = [
    { name: t('purchase_orders'), href: '/purchase_orders' },
  ];

  const company = useCurrentCompany();
  const formatMoney = useFormatMoney();

  const { dateFormat } = useCurrentCompanyDateFormats();

  const columns: DataTableColumns = [
    {
      id: 'status_id',
      label: t('status'),
      format: (field, purchaseOrder: PurchaseOrder) => (
        <Link
          to={generatePath('/purchase_orders/:id/edit', {
            id: purchaseOrder.id,
          })}
        >
          <StatusBadge for={purchaseOrderStatus} code={field} />
        </Link>
      ),
    },
    {
      id: 'number',
      label: t('number'),
      format: (field, purchaseOrder: PurchaseOrder) => (
        <Link
          to={generatePath('/purchase_orders/:id/edit', {
            id: purchaseOrder.id,
          })}
        >
          {field}
        </Link>
      ),
    },
    {
      id: 'vendor_id',
      label: t('vendor'),
      format: (field, purchaseOrder: PurchaseOrder) =>
        purchaseOrder.vendor && (
          <Link
            to={generatePath('/vendors/:id', { id: purchaseOrder.vendor.id })}
          >
            {purchaseOrder.vendor.name}
          </Link>
        ),
    },
    {
      id: 'expense_id',
      label: t('expense'),
      format: (field, purchaseOrder: PurchaseOrder) =>
        purchaseOrder.expense && (
          <Link
            to={generatePath('/expenses/:id', { id: purchaseOrder.expense.id })}
          >
            {purchaseOrder.expense.number}
          </Link>
        ),
    },
    {
      id: 'amount',
      label: t('amount'),
      format: (amount) =>
        formatMoney(
          amount,
          company?.settings.country_id,
          company?.settings.currency_id
        ),
    },
    {
      id: 'date',
      label: t('date'),
      format: (value) => date(value, dateFormat),
    },
    {
      id: 'due_date',
      label: t('due_date'),
      format: (value) => date(value, dateFormat),
    },
  ];

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <DataTable
        resource="purchase_order"
        endpoint="/api/v1/purchase_orders?include=vendor,expense"
        linkToCreate="/purchase_orders/create"
        linkToEdit="/purchase_orders/:id/edit"
        columns={columns}
        withResourcefulActions
      />
    </Default>
  );
}
