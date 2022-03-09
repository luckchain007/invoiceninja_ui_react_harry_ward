/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from 'common/hooks/useTitle';
import { useProductQuery } from 'common/queries/products';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { Container } from 'components/Container';
import { Default } from 'components/layouts/Default';
import { Tab, Tabs } from 'components/Tabs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Outlet, useParams } from 'react-router-dom';

export function Product() {
  const { documentTitle, setDocumentTitle } = useTitle('product');
  const [t] = useTranslation();
  const { id } = useParams();
  const { data: product } = useProductQuery({ id });

  useEffect(() => {
    setDocumentTitle(product?.data?.data?.product_key || 'product');
  }, [product]);

  const pages: BreadcrumRecord[] = [
    { name: t('products'), href: '/products' },
    {
      name: documentTitle,
      href: generatePath('/products/:id', { id }),
    },
  ];

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: generatePath('/products/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: generatePath('/products/:id/documents', { id }),
    },
    {
      name: t('product_fields'),
      href: generatePath('/products/:id/product_fields', { id }),
    },
  ];

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <Container>
        <Tabs tabs={tabs} />

        <Outlet />
      </Container>
    </Default>
  );
}
