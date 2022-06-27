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
import { Checkbox, InputField, SelectField } from '@invoiceninja/forms';
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { User } from 'common/interfaces/user';
import { useUserQuery } from 'common/queries/users';
import { Alert } from 'components/Alert';
import Toggle from 'components/forms/Toggle';
import { Settings } from 'components/layouts/Settings';
import { clone, cloneDeep } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Details } from './components/Details';

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

  const onSave = () => {
    const toastId = toast.loading(t('processing'));

    request(
      'PUT',
      endpoint('/api/v1/users/:id?include=company_user', { id }),
      user
    )
      .then((response) => {
        toast.success(t('updated_user'), { id: toastId });

        setUser(response.data.data);
      })
      .catch((error) => {
        console.error(error);

        toast.error(t('error_title'), { id: toastId });
      });
  };

  const notifications = [
    { id: 'invoice_created', label: 'invoice_created' },
    { id: 'invoice_sent', label: 'notification_invoice_sent' },
    { id: 'invoice_viewed', label: 'invoice_viewed' },
    { id: 'invoice_late', label: 'invoice_late' },
    { id: 'payment_success', label: 'payment_success' },
    { id: 'payment_failure', label: 'payment_failure' },
    { id: 'quote_created', label: 'quote_created' },
    { id: 'quote_sent', label: 'quote_sent' },
    { id: 'quote_viewed', label: 'quote_viewed' },
    { id: 'quote_approved', label: 'quote_approved' },
    { id: 'quote_expired', label: 'quote_expired' },
    { id: 'credit_created', label: 'credit_created' },
    { id: 'credit_sent', label: 'credit_sent' },
    { id: 'credit_viewed', label: 'credit_viewed' },
  ];

  const defaultNotificationValue = () => {
    const notifications = user?.company_user?.notifications.email ?? [];

    if (notifications.includes('all_notifications')) {
      return 'all_notifications';
    }

    if (notifications.includes('all_user_notifications')) {
      return 'all_user_notifications';
    }

    return '';
  };

  const notificationValue = (id: string) => {
    const notifications = user?.company_user?.notifications.email ?? [];

    if (notifications.includes('all_notifications')) {
      return `${id}_all`;
    }

    if (notifications.includes('all_user_notifications')) {
      return `${id}_user`;
    }

    if (notifications.includes(`${id}_all`)) {
      return `${id}_all`;
    }

    if (notifications.includes(`${id}_user`)) {
      return `${id}_user`;
    }

    return `${id}_none`;
  };

  const isNotificationSelectDisabled = () => {
    const notifications = user?.company_user?.notifications.email ?? [];

    if (
      notifications.includes('all_notifications') ||
      notifications.includes('all_user_notifications')
    ) {
      return true;
    }

    return false;
  };

  const handleNotificationChange = (notification: string, value: string) => {
    const localUser = cloneDeep(user) as User;

    if (notification === 'all_events' && localUser.company_user) {
      value.length === 0
        ? (localUser.company_user.notifications.email = [])
        : (localUser.company_user.notifications.email = [value]);
    } else if (value.endsWith('none') && localUser.company_user) {
      // In case the notifications ends with "none", we just want
      // to wipe it from the notifications list.

      const filtered = localUser.company_user?.notifications.email.filter(
        (value) => !value.startsWith(notification)
      );

      localUser.company_user.notifications.email = filtered;
    } else {
      // Before we push new notification, we need to
      // make sure same notification with starter identifier
      // doesn't exist.

      const filtered =
        localUser.company_user?.notifications.email.filter(
          (value) => !value.startsWith(notification)
        ) || [];

      filtered?.push(value);

      if (localUser.company_user) {
        localUser.company_user.notifications.email = filtered;
      }
    }

    setUser({ ...localUser });
  };

  const handleAdministratorToggle = (value: boolean) => {
    setUser(
      (user) =>
        user && {
          ...user,
          company_user: user.company_user && {
            ...user.company_user,
            is_admin: value,
          },
        }
    );
  };

  const permissions = [
    'client',
    'product',
    'invoice',
    'payment',
    'recurring_invoice',
    'quote',
    'credit',
    'project',
    'task',
    'vendor',
    'expense',
  ];

  const handlePermissionChange = (permission: string, value: boolean) => {
    const permissions = clone(user?.company_user?.permissions ?? '')
      .split(',')
      .filter((value) => value !== permission);

    if (value) {
      permissions.push(permission);
    }

    if (permissions[0] === '') {
      permissions.shift();
    }

    setUser(
      (user) =>
        user && {
          ...user,
          company_user: user.company_user && {
            ...user.company_user,
            permissions: permissions.join(','),
          },
        }
    );
  };

  const isPermissionChecked = (permission: string) => {
    const permissions = user?.company_user?.permissions;
    const [type] = permission.split('_');

    if (permissions && permissions.includes(`${type}_all`)) {
      return true;
    }

    if (permissions && permissions.includes(permission)) {
      return true;
    }

    return false;
  };

  return (
    <Settings breadcrumbs={pages} title={t('edit_user')} onSaveClick={onSave}>
      {user && user.email_verified_at === null && (
        <Alert type="warning">{t('email_sent_to_confirm_email')}.</Alert>
      )}

      {user && <Details user={user} setUser={setUser} />}

      <Card title={t('notifications')}>
        <Element>{t('email')}</Element>

        <Element leftSide={t('all_events')}>
          <SelectField
            withBlank
            value={defaultNotificationValue()}
            onValueChange={(value) =>
              handleNotificationChange('all_events', value)
            }
          >
            <option value="all_notifications">{t('all_records')}</option>
            <option value="all_user_notifications">{t('owned_by_user')}</option>
            <option value="">{t('custom')}</option>
          </SelectField>
        </Element>

        {notifications.map((notification, index) => (
          <Element key={index} leftSide={t(notification.label)}>
            <SelectField
              value={notificationValue(notification.id)}
              disabled={isNotificationSelectDisabled()}
              onValueChange={(value) =>
                handleNotificationChange(notification.id, value)
              }
            >
              <option value={`${notification.id}_all`}>
                {t('all_records')}
              </option>
              <option value={`${notification.id}_user`}>
                {t('owned_by_user')}
              </option>
              <option value={`${notification.id}_none`}>{t('none')}</option>
            </SelectField>
          </Element>
        ))}
      </Card>

      <Card title={t('permissions')}>
        <Element
          leftSide={t('administrator')}
          leftSideHelp={t('administrator_help')}
        >
          <Toggle
            checked={user?.company_user?.is_admin}
            onChange={(value) => handleAdministratorToggle(value)}
          />
        </Element>

        <Element>
          <div className="grid grid-cols-3 md:grid-cols-6">
            <div className="col-1">{t('create')}</div>
            <div className="col-1">{t('view')}</div>
            <div className="col-1">{t('edit')}</div>
          </div>
        </Element>

        <Element leftSide={t('all')}>
          <div className="grid grid-cols-3  md:grid-cols-6">
            <div className="col-1">
              <Checkbox
                checked={isPermissionChecked('create_all')}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handlePermissionChange('create_all', event.target.checked)
                }
              />
            </div>
            <div className="col-1">
              <Checkbox
                checked={isPermissionChecked('view_all')}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handlePermissionChange('view_all', event.target.checked)
                }
              />
            </div>
            <div className="col-1">
              <Checkbox
                checked={isPermissionChecked('edit_all')}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handlePermissionChange('edit_all', event.target.checked)
                }
              />
            </div>
          </div>
        </Element>

        {permissions.map((permission, index) => (
          <Element key={index} leftSide={t(permission)}>
            <div className="grid grid-cols-3  md:grid-cols-6">
              <div className="col-1">
                <Checkbox
                  checked={isPermissionChecked(`create_${permission}`)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handlePermissionChange(
                      `create_${permission}`,
                      event.target.checked
                    )
                  }
                />
              </div>
              <div className="col-1">
                <Checkbox
                  checked={isPermissionChecked(`view_${permission}`)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handlePermissionChange(
                      `view_${permission}`,
                      event.target.checked
                    )
                  }
                />
              </div>
              <div className="col-1">
                <Checkbox
                  checked={isPermissionChecked(`edit_${permission}`)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handlePermissionChange(
                      `edit_${permission}`,
                      event.target.checked
                    )
                  }
                />
              </div>
            </div>
          </Element>
        ))}
      </Card>
    </Settings>
  );
}
