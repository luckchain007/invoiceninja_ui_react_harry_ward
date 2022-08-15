/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from 'common/hooks/useTitle';
import { Expense } from 'common/interfaces/expense';
import { useBlankExpenseQuery } from 'common/queries/expenses';
import { Default } from 'components/layouts/Default';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Details } from './components/Details';

export function Create() {
  const [t] = useTranslation();

  const { documentTitle } = useTitle('new_expense');
  const { data } = useBlankExpenseQuery();

  const pages = [
    { name: t('expenses'), href: '/expenses' },
    { name: t('new_expense'), href: '/expenses/create' },
  ];

  const [expense, setExpense] = useState<Expense>();

  useEffect(() => {
    if (data) {
      setExpense(data);
    }
  }, [data]);

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-4">
          <Details expense={expense} setExpense={setExpense} />
        </div>
      </div>
    </Default>
  );
}
