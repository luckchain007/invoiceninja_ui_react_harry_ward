/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useStaticsQuery } from 'common/queries/statics';
import {
  updateChanges,
} from 'common/stores/slices/company-users';
import { RootState } from 'common/stores/store';
import { Card } from 'components/cards/Card';
import { Element } from 'components/cards/Element';
import { InputField } from 'components/forms/InputField';
import { SelectField } from 'components/forms/SelectField';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export function Details() {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const { data } = useStaticsQuery();

  const companyChanges = useSelector(
    (state: RootState) => state.companyUsers.changes.company
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateChanges({
        object: 'company',
        property: event.target.id,
        value: event.target.value,
      })
    );

  return (
    <>
      {companyChanges?.settings && (
        <Card title={t('details')}>
          <Element leftSide={t('name')}>
            <InputField
              value={companyChanges?.settings?.name || ''}
              onChange={handleChange}
              id="settings.name"
            />
          </Element>

          <Element leftSide={t('id_number')}>
            <InputField
              value={companyChanges?.settings?.id_number || ''}
              onChange={handleChange}
              id="settings.id_number"
            />
          </Element>

          <Element leftSide={t('vat_number')}>
            <InputField
              value={companyChanges?.settings?.vat_number || ''}
              onChange={handleChange}
              id="settings.vat_number"
            />
          </Element>

          <Element leftSide={t('website')}>
            <InputField
              value={companyChanges?.settings?.website || ''}
              onChange={handleChange}
              id="settings.website"
            />
          </Element>

          <Element leftSide={t('email')}>
            <InputField
              value={companyChanges?.settings?.email || ''}
              onChange={handleChange}
              id="settings.email"
            />
          </Element>

          <Element leftSide={t('phone')}>
            <InputField
              value={companyChanges?.settings?.phone || ''}
              onChange={handleChange}
              id="settings.phone"
            />
          </Element>

          <Element leftSide={t('size_id')}>
            <SelectField
              value={companyChanges?.size_id || '1'}
              onChange={handleChange}
              id="size_id"
            >
              {data?.data.sizes.map((size: { id: string; name: string }) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </SelectField>
          </Element>

          <Element leftSide={t('industry_id')}>
            <SelectField
              value={companyChanges?.industry_id || '1'}
              onChange={handleChange}
              id="industry_id"
            >
              {data?.data.industries.map(
                (industry: { id: string; name: string }) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                )
              )}
            </SelectField>
          </Element>
        </Card>
      )}
    </>
  );
}
