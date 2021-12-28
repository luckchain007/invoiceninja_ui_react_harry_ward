/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  user_id: string;
  archived_at: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
}
