/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { InputField } from '@invoiceninja/forms';
import { Table, Tbody, Td, Th, Thead, Tr } from '@invoiceninja/tables';
import { InvoiceItem } from 'common/interfaces/invoice-item';
import { setCurrentInvoiceLineItemProperty } from 'common/stores/slices/invoices';
import { RootState } from 'common/stores/store';
import { ChangeEvent } from 'react';
import { Trash2 } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { resolveProperty } from '../../helpers/resolve-property';
import { useProductColumns } from '../../hooks/useProductColumns';
import { useResolveTranslation } from '../../hooks/useResolveTranslation';

export function Products() {
  const invoice = useSelector((state: RootState) => state.invoices.current);
  const columns = useProductColumns();
  const resolveTranslation = useResolveTranslation();
  const dispatch = useDispatch();

  const onChange = (key: keyof InvoiceItem, value: unknown, index: number) => {
    dispatch(
      setCurrentInvoiceLineItemProperty({
        position: index,
        property: key,
        value,
      })
    );
  };

  const resolveInputField = (key: string, index: number) => {
    const property = resolveProperty(key);

    const numberInputs = [
      'discount',
      'cost',
      'unit_cost',
      'quantity',
      'tax_rate1',
      'tax_rate2',
      'tax_rate3',
    ];

    if (numberInputs.includes(property)) {
      return (
        <InputField
          id={property}
          type="number"
          value={invoice?.line_items[index][property]}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(property, parseFloat(event.target.value), index)
          }
        />
      );
    }

    if (['line_total'].includes(property)) {
      return <span>{invoice?.line_items[index][property]}</span>;
    }

    return (
      <InputField
        id={property}
        value={invoice?.line_items[index][property]}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(property, event.target.value, index)
        }
      />
    );
  };

  return (
    <div>
      {invoice && (
        <Table>
          <Thead>
            {columns.map((column, index) => (
              <Th key={index}>{resolveTranslation(column)}</Th>
            ))}
            <Th>{/* This is placeholder for "Remove" button. */}</Th>
          </Thead>
          <Tbody>
            {invoice &&
              invoice.line_items.map((lineItem, lineItemIndex) => (
                <Tr key={lineItemIndex}>
                  {columns.map((column, columnIndex) => (
                    <Td key={columnIndex}>
                      {resolveInputField(column, lineItemIndex)}
                    </Td>
                  ))}

                  <Td>
                    {invoice && invoice.line_items.length >= 2 && (
                      <button
                        className="text-gray-600 hover:text-red-600"
                        // onClick={() => deleteLineItem(lineItemIndex)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
