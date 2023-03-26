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
import { CompanyGateway } from '$app/common/interfaces/company-gateway';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { Check } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';

export function Gateways() {
  const [t] = useTranslation();

  const columns: DataTableColumns<CompanyGateway> = [
    {
      id: 'label',
      label: t('label'),
      format: (field, resource) => (
        <Link to={route('/settings/gateways/:id/edit', { id: resource.id })}>
          {field}
        </Link>
      ),
    },
    {
      id: 'test_mode',
      label: t('test_mode'),
      format: (field) => (field ? <Check size={20} /> : ''),
    },
  ];

  return (
    <DataTable
      columns={columns}
      resource="company_gateway"
      endpoint="/api/v1/company_gateways?sort=id|desc"
      bulkRoute="/api/v1/company_gateways/bulk"
      linkToCreate="/settings/gateways/create"
      linkToEdit="/settings/gateways/:id/edit"
      withResourcefulActions
    />
  );
}
