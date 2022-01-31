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
import {
  Upload,
  Table as DocumentsTable,
} from 'pages/settings/company/documents/components';
import { generatePath, useParams } from 'react-router-dom';
import { Tabs, Tab } from 'components/Tabs';
import { Default } from 'components/layouts/Default';
import { Container } from 'components/Container';

export function ProductDocs() {
  const apiEndpoint = 'api/v1/projects/:id/upload';
  const [t] = useTranslation();
  const { id } = useParams();

  const tabs: Tab[] = [
    { name: t('overview'), href: generatePath('/products/:id', { id }) },

    {
      name: t('document'),
      href: generatePath('/products/:id/documents', { id }),
    },
  ];

  const pages = [
    { name: t('products'), href: '/products' },
    {
      name: t('product'),
      href: generatePath('/products/:id', { id }),
    },
  ];

  return (
    <Default breadcrumbs={pages}>
      <Container>
        <Tabs tabs={tabs} className="mt-6" />

        <Upload apiEndpoint={apiEndpoint} />
        <DocumentsTable />
      </Container>
    </Default>
  );
}
