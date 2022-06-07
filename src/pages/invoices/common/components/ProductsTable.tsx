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
import { Plus, Trash2 } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useProductColumns } from '../hooks/useProductColumns';
import { useResolveInputField } from '../hooks/useResolveInputField';
import { useResolveTranslation } from '../hooks/useResolveTranslation';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useHandleSortingRows } from '../hooks/useHandleSortingRows';
import { resolveColumnWidth } from '../helpers/resolve-column-width';
import { Invoice } from 'common/interfaces/invoice';
import { InvoiceItem } from 'common/interfaces/invoice-item';

interface Props {
  resource: Invoice;
  onProductChange: (index: number, lineItem: InvoiceItem) => unknown;
  onSort: (lineItems: InvoiceItem[]) => unknown;
  onLineItemPropertyChange: (
    key: keyof InvoiceItem,
    value: unknown,
    index: number
  ) => unknown;
  onDeleteRowClick: (index: number) => unknown;
  onCreateItemClick: () => unknown;
}

export function ProductsTable(props: Props) {
  const [t] = useTranslation();

  const resource = props.resource;
  const columns = useProductColumns();

  const resolveTranslation = useResolveTranslation();

  const resolveInputField = useResolveInputField({
    resource: props.resource,
    onProductChange: props.onProductChange,
    onLineItemPropertyChange: props.onLineItemPropertyChange,
  });

  const onDragEnd = useHandleSortingRows({
    resource: props.resource,
    onSort: props.onSort,
  });

  return (
    <Table>
      <Thead>
        {columns.map((column, index) => (
          <Th key={index}>{resolveTranslation(column)}</Th>
        ))}
      </Thead>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="product-table">
          {(provided) => (
            <Tbody {...provided.droppableProps} innerRef={provided.innerRef}>
              {resource?.client_id &&
                resource.line_items.map((lineItem, lineItemIndex) => (
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
                        {columns.map((column, columnIndex, { length }) => (
                          <Td
                            width={resolveColumnWidth(column)}
                            key={columnIndex}
                          >
                            {length - 1 !== columnIndex &&
                              resolveInputField(column, lineItemIndex)}

                            {length - 1 === columnIndex && (
                              <div className="flex justify-between items-center">
                                {resolveInputField(column, lineItemIndex)}

                                {resource &&
                                  (lineItem.product_key || lineItemIndex > 0) &&
                                  resource.line_items.length > 0 && (
                                    <button
                                      className="ml-2 text-gray-600 hover:text-red-600"
                                      onClick={() =>
                                        props.onDeleteRowClick(lineItemIndex)
                                      }
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                              </div>
                            )}
                          </Td>
                        ))}
                      </Tr>
                    )}
                  </Draggable>
                ))}

              {resource?.client_id && (
                <Tr className="bg-slate-100 hover:bg-slate-200">
                  <Td colSpan={100}>
                    <button
                      onClick={() => props.onCreateItemClick()}
                      className="w-full py-2 inline-flex justify-center items-center space-x-2"
                    >
                      <Plus size={18} />
                      <span>{t('add_item')}</span>
                    </button>
                  </Td>
                </Tr>
              )}

              {!resource?.client_id && (
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
