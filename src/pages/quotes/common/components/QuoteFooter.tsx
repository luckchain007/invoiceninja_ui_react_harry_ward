/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Tab } from '@headlessui/react';
import { Card } from '@invoiceninja/cards';
import { InputField, InputLabel } from '@invoiceninja/forms';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useHandleCustomFieldChange } from 'common/hooks/useHandleCustomFieldChange';
import { DebouncedCombobox } from 'components/forms/DebouncedCombobox';
import { MarkdownEditor } from 'components/forms/MarkdownEditor';
import Toggle from 'components/forms/Toggle';
import { TabGroup } from 'components/TabGroup';
import { Field } from 'pages/settings/custom-fields/components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentQuote } from '../hooks/useCurrentQuote';
import { useSetCurrentQuoteProperty } from '../hooks/useSetCurrentQuoteProperty';
import { QuoteDocuments } from './QuoteDocuments';

interface Props {
  page: 'create' | 'edit';
}

export function QuoteFooter(props: Props) {
  const [t] = useTranslation();

  const company = useCurrentCompany();
  const quote = useCurrentQuote();

  const handleChange = useSetCurrentQuoteProperty();
  const handleCustomFieldChange = useHandleCustomFieldChange();

  const [tabs, setTabs] = useState([
    t('terms'),
    t('footer'),
    t('public_notes'),
    t('private_notes'),
    t('documents'),
    t('settings'),
    t('custom_fields'),
  ]);

  useEffect(() => {
    if (props.page === 'create') {
      setTabs((current) => current.filter((tab) => tab !== t('documents')));
    }
  }, []);

  return (
    <Card className="col-span-12 xl:col-span-8 h-max px-6">
      <TabGroup tabs={tabs}>
        <Tab.Panel>
          <MarkdownEditor
            value={quote?.terms || ''}
            onChange={(value) => handleChange('terms', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={quote?.footer || ''}
            onChange={(value) => handleChange('footer', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={quote?.public_notes || ''}
            onChange={(value) => handleChange('public_notes', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={quote?.private_notes || ''}
            onChange={(value) => handleChange('private_notes', value)}
          />
        </Tab.Panel>

        {props.page === 'edit' ? (
          <Tab.Panel>
            <QuoteDocuments />
          </Tab.Panel>
        ) : (
          <></>
        )}

        <Tab.Panel>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <InputLabel>{t('user')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/users"
                  label="first_name"
                  onChange={(value) =>
                    handleChange('assigned_user_id', value.value)
                  }
                  defaultValue={quote?.assigned_user_id}
                />
              </div>

              <div className="space-y-2">
                <InputLabel>{t('vendor')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/vendors"
                  label="name"
                  onChange={(value) => handleChange('vendor_id', value.value)}
                  defaultValue={quote?.vendor_id}
                />
              </div>

              <div className="space-y-2">
                <InputLabel>{t('design')}</InputLabel>

                <DebouncedCombobox
                  endpoint="/api/v1/designs"
                  label="name"
                  placeholder={t('search_designs')}
                  onChange={(payload) =>
                    handleChange('design_id', payload.value)
                  }
                  defaultValue={
                    quote?.design_id ?? company?.settings?.invoice_design_id
                  }
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <InputLabel>{t('project')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/projects"
                  label="name"
                  onChange={(value) => handleChange('project_id', value.value)}
                  defaultValue={quote?.project_id}
                />
              </div>

              <div className="space-y-2">
                <InputField
                  label={t('exchange_rate')}
                  value={quote?.exchange_rate || '1.00'}
                  onValueChange={(value) =>
                    handleChange('exchange_rate', parseFloat(value))
                  }
                />
              </div>

              <div className="pt-9">
                <Toggle
                  label={t('auto_bill_enabled')}
                  checked={quote?.auto_bill_enabled || false}
                  onChange={(value) => handleChange('auto_bill_enabled', value)}
                />
              </div>
            </div>
          </div>
        </Tab.Panel>

        <Tab.Panel>
          {company &&
            ['quote1', 'quote2', 'quote3', 'quote4'].map((field) => (
              <Field
                key={field}
                initialValue={company.custom_fields[field]}
                field={field}
                placeholder={t('custom_field')}
                onChange={(value: any) => handleCustomFieldChange(field, value)}
                noExternalPadding
              />
            ))}
        </Tab.Panel>
      </TabGroup>
    </Card>
  );
}
