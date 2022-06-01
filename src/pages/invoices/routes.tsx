/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from 'common/guards/Guard';
import { permission } from 'common/guards/guards/permission';
import { Route } from 'react-router-dom';
import { Clone } from './clone/Clone';
import { Create } from './create/Create';
import { Edit } from './edit/Edit';
import { Email } from './email/Email';
import { Invoices } from './index/Invoices';
import { Pdf } from './pdf/Pdf';

export const invoiceRoutes = (
  <Route path="/invoices">
    <Route
      path=""
      element={
        <Guard
          guards={[() => permission('view_invoice')]}
          component={<Invoices />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard
          guards={[() => permission('create_invoice')]}
          component={<Create />}
        />
      }
    />
    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            () => permission('view_invoice'),
            () => permission('edit_invoice'),
          ]}
          component={<Edit />}
        />
      }
    />
    <Route
      path=":id/pdf"
      element={
        <Guard
          guards={[() => permission('view_invoice')]}
          component={<Pdf />}
        />
      }
    />
    <Route path=":id/email" element={<Email />} />
    <Route path=":id/clone" element={<Clone />} />
  </Route>
);
