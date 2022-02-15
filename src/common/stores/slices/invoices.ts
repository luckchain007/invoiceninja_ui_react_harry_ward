/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from 'common/interfaces/invoice';

interface InvoiceState {
  api?: any;
  current?: Invoice;
}

const initialState: InvoiceState = {
  api: {},
};

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setCurrentInvoice: (state, payload: PayloadAction<Invoice>) => {
      state.current = payload.payload;
    },
  },
});

export const { setCurrentInvoice } = invoiceSlice.actions;
