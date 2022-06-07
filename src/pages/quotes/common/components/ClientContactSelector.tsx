/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Checkbox } from '@invoiceninja/forms';
import { useClientResolver } from 'common/hooks/clients/useClientResolver';
import { Client } from 'common/interfaces/client';
import { toggleCurrentQuoteInvitation } from 'common/stores/slices/quotes';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useCurrentQuote } from '../hooks/useCurrentQuote';

export function ClientContactSelector() {
  const [client, setClient] = useState<Client>();
  const quote = useCurrentQuote();
  const clientResolver = useClientResolver();
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const handleContactCheckboxChange = (contactId: string, value: boolean) => {
    dispatch(toggleCurrentQuoteInvitation({ contactId, checked: value }));
  };

  const handleCheckedState = (contactId: string) => {
    const potential = quote?.invitations.find(
      (i) => i.client_contact_id === contactId
    );

    return Boolean(potential);
  };

  useEffect(() => {
    quote?.client_id &&
      clientResolver.find(quote.client_id).then((client) => setClient(client));
  }, [quote?.client_id]);

  return (
    <>
      {quote?.client_id &&
        client &&
        client.contacts.map((contact, index) => (
          <div key={index}>
            <Checkbox
              id={contact.id}
              value={contact.id}
              label={
                contact.first_name.length >= 1
                  ? `${contact.first_name} ${contact.last_name}`
                  : t('blank_contact')
              }
              checked={handleCheckedState(contact.id)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleContactCheckboxChange(
                  event.target.value,
                  event.target.checked
                )
              }
            />

            <span className="text-sm text-gray-700">{contact.email}</span>
          </div>
        ))}
    </>
  );
}
