/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface CompanyGateway {
  id: string;
  gateway_key: string;
  accepted_credit_cards: number;
  require_cvv: boolean;
  require_billing_address: boolean;
  require_shipping_address: boolean;
  require_client_name: boolean;
  require_zip: boolean;
  require_postal_code: boolean;
  require_client_phone: boolean;
  require_contact_name: boolean;
  require_contact_email: boolean;
  show_billing_address: boolean;
  show_shipping_address: boolean;
  update_details: boolean;
  config: string;
  fees_and_limits: FeesAndLimits;
  updated_at: number;
  archived_at: number;
  created_at: number;
  is_deleted: boolean;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  label: string;
  token_billing: string;
  test_mode: boolean;
}

export interface FeesAndLimits {}
