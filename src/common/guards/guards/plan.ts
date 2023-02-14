/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from '../Guard';

export type Plan = 'pro' | 'enterprise' | 'white_label';

export function plan(p: Plan): Guard {
  return ({ companyUser }) =>
    new Promise((resolve) => {
      if (companyUser?.account.plan === p) {
        return resolve(true);
      }

      return resolve(false);
    });
}
