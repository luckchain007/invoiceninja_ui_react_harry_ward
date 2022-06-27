/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '@invoiceninja/cards';
import { InputField } from '@invoiceninja/forms';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { User } from 'common/interfaces/user';
import { useUserQuery } from 'common/queries/users';
import { Settings } from 'components/layouts/Settings';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

export function Edit() {
  const { id } = useParams();
  const { data: response } = useUserQuery({ id });

  const [user, setUser] = useState<User>();
  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('user_management'), href: '/settings/users' },
    {
      name: t('edit_user'),
      href: generatePath('/settings/users/:id/edit', { id }),
    },
  ];

  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (response?.data.data && response.data.data.email === currentUser.email) {
      navigate('/settings/user_details');
    } else {
      setUser(response?.data.data);
    }
  }, [response?.data.data]);

  const onChange = (field: keyof User, value: unknown) => {
    setUser((user) => user && { ...user, [field]: value });
  };

  return (
    <Settings breadcrumbs={pages} title={t('edit_user')}>
      <Card title={t('details')}>
        <Element leftSide={t('first_name')}>
          <InputField
            value={user?.first_name}
            onValueChange={(value) => onChange('first_name', value)}
          />
        </Element>

        <Element leftSide={t('last_name')}>
          <InputField
            value={user?.last_name}
            onValueChange={(value) => onChange('last_name', value)}
          />
        </Element>

        <Element leftSide={t('email')}>
          <InputField
            type="email"
            value={user?.email}
            onValueChange={(value) => onChange('email', value)}
          />
        </Element>

        <Element leftSide={t('phone')}>
          <InputField
            value={user?.phone}
            onValueChange={(value) => onChange('phone', value)}
          />
        </Element>
      </Card>
    </Settings>
  );
}
