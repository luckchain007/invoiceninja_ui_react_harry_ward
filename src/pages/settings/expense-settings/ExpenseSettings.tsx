/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCompanyChanges } from 'common/hooks/useCompanyChanges';
import { useInjectCompanyChanges } from 'common/hooks/useInjectCompanyChanges';
import { useTitle } from 'common/hooks/useTitle';
import { updateChanges } from 'common/stores/slices/company-users';
import { Divider } from 'components/cards/Divider';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Card, Element } from '../../../components/cards';
import { Radio } from '../../../components/forms';
import Toggle from '../../../components/forms/Toggle';
import { Settings } from '../../../components/layouts/Settings';
import { useDiscardChanges } from '../common/hooks/useDiscardChanges';
import { useHandleCompanySave } from '../common/hooks/useHandleCompanySave';
import { ExpenseCategories } from '../expense-categories';

export function ExpenseSettings() {
  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('expense_settings'), href: '/settings/expense_settings' },
  ];

  const dispatch = useDispatch();

  useTitle('expense_settings');
  useInjectCompanyChanges();

  const companyChanges = useCompanyChanges();

  const handleToggleChange = (id: string, value: boolean) =>
    dispatch(
      updateChanges({
        object: 'company',
        property: id,
        value,
      })
    );

  const onSave = useHandleCompanySave();
  const onCancel = useDiscardChanges();

  return (
    <Settings
      onSaveClick={onSave}
      onCancelClick={onCancel}
      title={t('expense_settings')}
      breadcrumbs={pages}
      docsLink="docs/basic-settings/#expense_settings"
    >
      <Card title={t('settings')}>
        <Element
          leftSide={t('should_be_invoiced')}
          leftSideHelp={t('should_be_invoiced_help')}
        >
          <Toggle
            checked={companyChanges?.mark_expenses_invoiceable}
            onChange={(value: boolean) =>
              handleToggleChange('mark_expenses_invoiceable', value)
            }
          />
        </Element>

        <Element leftSide={t('mark_paid')} leftSideHelp={t('mark_paid_help')}>
          <Toggle
            checked={companyChanges?.mark_expenses_paid}
            onChange={(value: boolean) =>
              handleToggleChange('mark_expenses_paid', value)
            }
          />
        </Element>

        <Element
          leftSide={t('add_documents_to_invoice')}
          leftSideHelp={t('add_documents_to_invoice_help')}
        >
          <Toggle
            checked={companyChanges?.invoice_expense_documents}
            onChange={(value: boolean) =>
              handleToggleChange('invoice_expense_documents', value)
            }
          />
        </Element>

        <Divider />

        <Element leftSide={t('enter_taxes')}>
          <Radio
            onValueChange={(value) =>
              dispatch(
                updateChanges({
                  object: 'company',
                  property: 'calculate_expense_tax_by_amount',
                  value: value === 'true' ? true : false,
                })
              )
            }
            options={[
              { id: 'by_rate', title: t('by_rate'), value: 'false' },
              { id: 'by_amount', title: t('by_amount'), value: 'true' },
            ]}
            name="calculate_expense_tax_by_amount"
            defaultSelected={companyChanges?.calculate_expense_tax_by_amount.toString()}
          />
        </Element>

        <Element
          leftSide={t('inclusive_taxes')}
          leftSideHelp={
            <span className="flex flex-col">
              <span>{t('exclusive')}: 100 + 10% = 100 + 10</span>
              <span>{t('inclusive')}: 100 + 10% = 90.91 + 9.09</span>
            </span>
          }
        >
          <Toggle
            onChange={(value: boolean) =>
              handleToggleChange('expense_inclusive_taxes', value)
            }
            checked={companyChanges?.expense_inclusive_taxes || false}
          />
        </Element>
      </Card>

      <ExpenseCategories />
    </Settings>
  );
}
