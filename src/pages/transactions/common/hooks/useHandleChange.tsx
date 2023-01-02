/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { DecimalInputSeparators } from 'common/interfaces/decimal-number-input-separators';
import { Transaction } from 'common/interfaces/transactions';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';
import { useResolveCurrencySeparator } from './useResolveCurrencySeparator';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  setCurrencySeparators: Dispatch<
    SetStateAction<DecimalInputSeparators | undefined>
  >;
}

export function useHandleChange(params: Params) {
  const resolveCurrencySeparator = useResolveCurrencySeparator();

  const { setErrors, setCurrencySeparators, setTransaction } = params;

  return (
    property: keyof Transaction,
    value: Transaction[keyof Transaction]
  ) => {
    setErrors(undefined);

    if (property === 'currency_id') {
      const resolvedCurrencySeparator = resolveCurrencySeparator(
        value.toString()
      );

      if (resolvedCurrencySeparator) {
        setCurrencySeparators(resolvedCurrencySeparator);
      }
    }

    setTransaction(
      (transaction) => transaction && { ...transaction, [property]: value }
    );
  };
}
