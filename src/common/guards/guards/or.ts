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

export function or(...guards: Guard[]): Guard {
  return async () => {
    const values: boolean[] = [];

    for (const guard of guards) {
      values.push(await guard({}));
    }

    return await new Promise((resolve) => {
      if (values.includes(false)) {
        return resolve(false);
      }

      return resolve(true);
    });
  };
}
