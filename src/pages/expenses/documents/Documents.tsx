/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useTitle } from '$app/common/hooks/useTitle';
import { useExpenseQuery } from '$app/common/queries/expenses';
import { Page } from '$app/components/Breadcrumbs';
import { DocumentsTable } from '$app/components/DocumentsTable';
import { Default } from '$app/components/layouts/Default';
import { Tab, Tabs } from '$app/components/Tabs';
import { Upload } from '$app/pages/settings/company/documents/components';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export default function Documents() {
  const [t] = useTranslation();

  const { documentTitle } = useTitle('documents');
  const { id } = useParams();

  const pages: Page[] = [
    { name: t('expenses'), href: '/expenses' },
    { name: t('expense'), href: route('/expenses/:id/edit', { id }) },
    {
      name: t('documents'),
      href: route('/expenses/:id/documents', { id }),
    },
  ];

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/expenses/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: route('/expenses/:id/documents', { id }),
    },
  ];

  const { data: expense } = useExpenseQuery({ id });

  const queryClient = useQueryClient();

  const invalidateCache = () => {
    queryClient.invalidateQueries(route('/api/v1/expenses/:id', { id }));
  };

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <div className="space-y-4">
        <Tabs tabs={tabs} />

        <div className="w-2/3">
          <Upload
            widgetOnly
            endpoint={endpoint('/api/v1/expenses/:id/upload', { id })}
            onSuccess={invalidateCache}
          />

          <DocumentsTable
            documents={expense?.documents || []}
            onDocumentDelete={invalidateCache}
          />
        </div>
      </div>
    </Default>
  );
}
