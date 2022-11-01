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
import { date } from 'common/helpers';
import { route } from 'common/helpers/route';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useCurrentCompanyDateFormats } from 'common/hooks/useCurrentCompanyDateFormats';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { useResolveCountry } from 'common/hooks/useResolveCountry';
import { useResolveCurrency } from 'common/hooks/useResolveCurrency';
import { Vendor } from 'common/interfaces/vendor';
import { CopyToClipboard } from 'components/CopyToClipboard';
import { customField } from 'components/CustomField';
import { EntityStatus } from 'components/EntityStatus';
import { DataTableColumnsExtended } from 'pages/invoices/common/hooks/useInvoiceColumns';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const vendorColumns = [
  'number',
  'name',
  'city',
  'phone',
  'entity_state',
  'created_at',
  'address2',
  'archived_at',
  //   'assigned_to', @Todo: Need to resolve relationship
  'contacts',
  'country_id',
  //   'created_by', @Todo: Need to resolve relationship
  'currency_id',
  'custom1',
  'custom2',
  'custom3',
  'custom4',
  'documents',
  'id_number',
  'is_deleted',
  'postal_code',
  'private_notes',
  'address1',
  'updated_at',
  'vat_number',
  'website',
] as const;

type VendorColumns = typeof vendorColumns[number];

export const defaultColumns: VendorColumns[] = [
  'number',
  'name',
  'city',
  'phone',
  'entity_state',
  'created_at',
];

export function useVendorColumns() {
  const { t } = useTranslation();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const currentUser = useCurrentUser();
  const company = useCurrentCompany();
  const resolveCountry = useResolveCountry();
  const resolveCurrency = useResolveCurrency();

  const getContactsColumns = useCallback((vendor: Vendor) => {
    const names: string[] = [];

    vendor.contacts.map((contact) =>
      names.push(`${contact.first_name} ${contact.last_name}`)
    );

    return names.join('<br />');
  }, []);

  const columns: DataTableColumnsExtended<Vendor, VendorColumns> = [
    {
      column: 'number',
      id: 'number',
      label: t('number'),
      format: (value, vendor) => (
        <Link to={route('/vendors/:id', { id: vendor.id })}>{value}</Link>
      ),
    },
    {
      column: 'name',
      id: 'name',
      label: t('name'),
      format: (value, vendor) => (
        <Link to={route('/vendors/:id', { id: vendor.id })}>{value}</Link>
      ),
    },
    {
      column: 'city',
      id: 'city',
      label: t('city'),
    },
    {
      column: 'phone',
      id: 'phone',
      label: t('phone'),
    },
    {
      column: 'entity_state',
      id: 'id',
      label: t('entity_state'),
      format: (value, vendor) => <EntityStatus entity={vendor} />,
    },
    {
      column: 'created_at',
      id: 'created_at',
      label: t('created_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'address1',
      id: 'address1',
      label: t('address1'),
    },
    {
      column: 'address2',
      id: 'address2',
      label: t('address2'),
    },
    {
      column: 'archived_at',
      id: 'archived_at',
      label: t('archived_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'contacts',
      id: 'id',
      label: t('contacts'),
      format: (value, vendor) => (
        <span
          dangerouslySetInnerHTML={{ __html: getContactsColumns(vendor) }}
        />
      ),
    },
    {
      column: 'country_id',
      id: 'country_id',
      label: t('country'),
      format: (value) => value && resolveCountry(value)?.name,
    },
    {
      column: 'currency_id',
      id: 'id',
      label: t('currency'),
      format: (value) => value && resolveCurrency(value)?.code,
    },
    {
      column: 'custom1',
      id: 'custom_value1',
      label:
        (company?.custom_fields.vendor1 &&
          customField(company?.custom_fields.vendor1).label()) ||
        t('first_custom'),
    },
    {
      column: 'custom2',
      id: 'custom_value2',
      label:
        (company?.custom_fields.vendor2 &&
          customField(company?.custom_fields.vendor2).label()) ||
        t('second_custom'),
    },
    {
      column: 'custom3',
      id: 'custom_value3',
      label:
        (company?.custom_fields.vendor3 &&
          customField(company?.custom_fields.vendor3).label()) ||
        t('third_custom'),
    },
    {
      column: 'custom4',
      id: 'custom_value4',
      label:
        (company?.custom_fields.vendor4 &&
          customField(company?.custom_fields.vendor4).label()) ||
        t('forth_custom'),
    },
    {
      column: 'documents',
      id: 'documents',
      label: t('documents'),
      format: (value, vendor) => vendor.documents.length,
    },
    {
      column: 'id_number',
      id: 'id_number',
      label: t('id_number'),
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, vendor) => (vendor.is_deleted ? t('yes') : t('no')),
    },
    {
      column: 'postal_code',
      id: 'postal_code',
      label: t('postal_code'),
    },
    {
      column: 'private_notes',
      id: 'private_notes',
      label: t('private_notes'),
      format: (value) => <span className="truncate">{value}</span>,
    },
    {
      column: 'updated_at',
      id: 'updated_at',
      label: t('updated_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'vat_number',
      id: 'vat_number',
      label: t('vat_number'),
    },
    {
      column: 'website',
      id: 'website',
      label: t('website'),
      format: (value) => <CopyToClipboard text={value.toString()} />,
    },
  ];

  const list: string[] =
    currentUser?.company_user?.settings?.react_table_columns?.vendor ||
    defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}
