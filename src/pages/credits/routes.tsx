/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from '$app/common/guards/Guard';
import { assigned } from '$app/common/guards/guards/assigned';
import { enabled } from '$app/common/guards/guards/enabled';
import { or } from '$app/common/guards/guards/or';
import { permission } from '$app/common/guards/guards/permission';
import { ModuleBitmask } from '$app/pages/settings/account-management/component';
import { Route } from 'react-router-dom';
import { Create } from './create/Create';
import { Edit } from './edit/Edit';
import { Email } from './email/Email';
import { Credits } from './index/Credits';
import { Pdf } from './pdf/Pdf';

export const creditRoutes = (
  <Route path="/credits">
    <Route
      path=""
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Credits),
            or(
              permission('view_credit'),
              permission('create_credit'),
              permission('edit_credit')
            ),
          ]}
          component={<Credits />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard
          guards={[enabled(ModuleBitmask.Credits), permission('create_credit')]}
          component={<Create />}
        />
      }
    />
    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Credits),
            or(
              permission('edit_credit'),
              permission('view_credit'),
              assigned('/api/v1/credits/:id')
            ),
          ]}
          component={<Edit />}
        />
      }
    />
    <Route
      path=":id/pdf"
      element={
        <Guard
          guards={[
            enabled(ModuleBitmask.Credits),
            or(
              permission('view_credit'),
              permission('edit_credit'),
              assigned('/api/v1/credits/:id')
            ),
          ]}
          component={<Pdf />}
        />
      }
    />
    <Route path=":id/email" element={<Email />} />
  </Route>
);
