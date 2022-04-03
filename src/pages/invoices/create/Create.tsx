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
import { useBlankInvoiceQuery } from 'common/queries/invoices';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { Default } from 'components/layouts/Default';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath, useSearchParams } from 'react-router-dom';
import { ClientSelector } from '../common/components/ClientSelector';
import { InvoiceFooter } from '../common/components/InvoiceFooter';
import { InvoiceDetails } from '../common/components/InvoiceDetails';
import { ProductsTable } from '../common/components/ProductsTable';
import { InvoiceTotals } from '../common/components/InvoiceTotals';
import { setCurrentInvoice } from 'common/stores/slices/invoices/extra-reducers/set-current-invoice';
import { InvoicePreview } from '../common/components/InvoicePreview';
import { useHandleCreate } from './hooks/useHandleCreate';
import { useCurrentInvoice } from 'common/hooks/useCurrentInvoice';
import { Invoice } from 'common/interfaces/invoice';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { ValidationAlert } from 'components/ValidationAlert';
import { useSetCurrentInvoiceProperty } from '../common/hooks/useSetCurrentInvoiceProperty';

export function Create() {
  const { documentTitle } = useTitle('new_invoice');
  const { data: invoice } = useBlankInvoiceQuery();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<ValidationBag>();
  const handleCreate = useHandleCreate(setErrors);
  const currentInvoice = useCurrentInvoice();
  const [hasClientSet, setHasClientSet] = useState(false);
  const [searchParams] = useSearchParams();
  const handleChange = useSetCurrentInvoiceProperty();

  const pages: BreadcrumRecord[] = [
    { name: t('invoices'), href: '/invoices' },
    {
      name: t('new_invoice'),
      href: generatePath('/invoices/create'),
    },
  ];

  useEffect(() => {
    if (invoice?.data.data) {
      dispatch(setCurrentInvoice(invoice.data.data));
    }
  }, [invoice]);

  useEffect(() => {
    if (searchParams.has('client') && !hasClientSet && currentInvoice) {
      handleChange('client_id', searchParams.get('client'));
      setHasClientSet(true);
    }
  }, [currentInvoice]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onBackClick={generatePath('/invoices')}
      onSaveClick={() => handleCreate(currentInvoice as Invoice)}
    >
      {errors && <ValidationAlert errors={errors} />}

      <div className="grid grid-cols-12 gap-4">
        <ClientSelector />
        <InvoiceDetails />

        <div className="col-span-12">
          <ProductsTable />
        </div>

        <InvoiceFooter />
        <InvoiceTotals />
      </div>

      <div className="my-4">
        {currentInvoice && (
          <InvoicePreview
            for="create"
            resource={currentInvoice}
            entity="invoice"
          />
        )}
      </div>
    </Default>
  );
}
