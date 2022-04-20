/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export function defaultHeaders() {
  return {
    'X-Api-Token': localStorage.getItem('X-NINJA-TOKEN') as string,
    'X-Requested-With': 'XMLHttpRequest',
  };
}
