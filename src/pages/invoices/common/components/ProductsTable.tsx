/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Table, Tbody, Td, Th, Thead, Tr } from '@invoiceninja/tables';
import { injectBlankItemIntoCurrent } from 'common/stores/slices/invoices';
import { deleteInvoiceLineItem } from 'common/stores/slices/invoices/extra-reducers/delete-invoice-item';
import { RootState } from 'common/stores/store';
import { Plus, Trash2 } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useProductColumns } from '../hooks/useProductColumns';
import { useResolveInputField } from '../hooks/useResolveInputField';
import { useResolveTranslation } from '../hooks/useResolveTranslation';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useHandleSortingRows } from '../hooks/useHandleSortingRows';
import { resolveColumnWidth } from '../helpers/resolve-column-width';

export function ProductsTable() {
  const [t] = useTranslation();

  const invoice = useSelector((state: RootState) => state.invoices.current);
  const columns = useProductColumns();
  const dispatch = useDispatch();

  const resolveTranslation = useResolveTranslation();
  const resolveInputField = useResolveInputField();

  const onDragEnd = useHandleSortingRows();
  return (
    <Table>
      <Thead>
        {columns.map((column, index) => (
          <Th key={index}>{resolveTranslation(column)}</Th>
        ))}
        <Th>{/* This is placeholder for "Remove" button. */}</Th>
      </Thead>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="invoice-product-table">
          {(provided) => (
            <Tbody {...provided.droppableProps} innerRef={provided.innerRef}>
              {invoice?.client_id &&
                invoice.line_items.map((lineItem, lineItemIndex) => (
                  <Draggable
                    key={lineItemIndex}
                    draggableId={lineItemIndex.toString()}
                    index={lineItemIndex}
                  >
                    {(provided) => (
                      <Tr
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        key={lineItemIndex}
                      >
                        {columns.map((column, columnIndex) => (
                          <Td
                            width={resolveColumnWidth(column)}
                            key={columnIndex}
                          >
                            {resolveInputField(column, lineItemIndex)}
                          </Td>
                        ))}

                        <Td>
                          {invoice &&
                            (lineItem.product_key || lineItemIndex > 0) &&
                            invoice.line_items.length > 0 && (
                              <button
                                className="text-gray-600 hover:text-red-600"
                                onClick={() =>
                                  dispatch(deleteInvoiceLineItem(lineItemIndex))
                                }
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                        </Td>
                      </Tr>
                    )}
                  </Draggable>
                ))}

              {invoice?.client_id && (
                <Tr>
                  <Td colSpan={100}>
                    <button
                      onClick={() => dispatch(injectBlankItemIntoCurrent())}
                      className="w-full py-2 inline-flex justify-center items-center space-x-2"
                    >
                      <Plus size={18} />
                      <span>{t('add_item')}</span>
                    </button>
                  </Td>
                </Tr>
              )}

              {!invoice?.client_id && (
                <Tr>
                  <Td colSpan={100}>{t('no_client_selected')}.</Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Droppable>
      </DragDropContext>
    </Table>
  );
}
