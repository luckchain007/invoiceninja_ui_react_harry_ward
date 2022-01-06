/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface ApiWebhook {
  id: string;
  company_id: string;
  event_id: string;
  format: string;
  headers: Record<string, string>[];
  rest_method: string;
  target_url: string;
  user_id: string;
  created_at: number;
  is_deleted: boolean;
  updated_at: number;
  archived_at: number;
}
