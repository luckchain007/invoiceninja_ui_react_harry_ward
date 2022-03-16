/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { useTitle } from 'common/hooks/useTitle';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { DataTable, DataTableColumns } from 'components/DataTable';
import { Link } from '@invoiceninja/forms';
import { generatePath, useNavigate } from 'react-router-dom';
import { Default } from 'components/layouts/Default';
import { EntityStatus } from 'components/EntityStatus';
import { DropdownElement } from 'components/dropdown/DropdownElement';

export function Products() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const pages: BreadcrumRecord[] = [{ name: t('products'), href: '/products' }];
  useTitle('products');

  const columns: DataTableColumns = [
    {
      id: 'product_key',
      label: t('product_key'),
      format: (value, resource) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={resource} />

          <Link to={generatePath('/products/:id/edit', { id: resource.id })}>
            {value}
          </Link>
        </span>
      ),
    },
    {
      id: 'notes',
      label: t('notes'),
    },
    {
      id: 'cost',
      label: t('cost'),
    },
    {
      id: 'quantity',
      label: t('quantity'),
    },
  ];

  const actions = [
    (resource: any) => (
      <DropdownElement
        onClick={() => {
          navigate(`/products/${resource.id}/clone`);
          // console.log('custom action 1');
        }}
      >
        {t('clone')}
      </DropdownElement>
    ),
    (resource: any) => (
      <DropdownElement>{t('clone_to_invoice')}</DropdownElement>
    ),
  ];
  return (
    <Default title={t('products')} breadcrumbs={pages} docsLink="docs/products">
      <DataTable
        resource="product"
        columns={columns}
        endpoint="/api/v1/products"
        linkToCreate="/products/create"
        linkToEdit="/products/:id/edit"
        withResourcefulActions
        customActions={actions}
      />
    </Default>
  );
}
