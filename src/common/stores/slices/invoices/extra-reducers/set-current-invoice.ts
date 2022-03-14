/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ClientResolver } from 'common/helpers/clients/client-resolver';
import { CurrencyResolver } from 'common/helpers/currencies/currency-resolver';
import { Client } from 'common/interfaces/client';
import { Currency } from 'common/interfaces/currency';
import { Invoice } from 'common/interfaces/invoice';

const clientResolver = new ClientResolver();
const currencyResolver = new CurrencyResolver();

export const setCurrentInvoice = createAsyncThunk(
  'invoices/setCurrentInvoice',
  async (payload: Invoice) => {
    let client: Client | undefined = undefined;
    let currency: Currency | undefined = undefined;

    if (payload?.client_id) {
      client = await clientResolver.find(payload.client_id);
    }

    if (client && client?.settings?.currency_id) {
      currency = await currencyResolver.find(client.settings.currency_id);
    }

    return { client, currency, invoice: payload };
  }
);
