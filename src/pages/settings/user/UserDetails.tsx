/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button, InputField } from '@invoiceninja/forms';
import axios, { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { defaultHeaders } from 'common/queries/common/headers';
import {
  deletePassword,
  injectInChanges,
  resetChanges,
  updateUser,
} from 'common/stores/slices/user';
import { RootState } from 'common/stores/store';
import { Modal } from 'components/Modal';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Settings } from '../../../components/layouts/Settings';
import {
  AccentColor,
  Connect,
  Details,
  Notifications,
  Password,
} from './components';
import { TwoFactorAuthentication } from './components/TwoFactorAuthentication';

export function UserDetails() {
  const [t] = useTranslation();
  const user = useCurrentUser();
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: ${t('user_details')}`;

    dispatch(injectInChanges());
  }, [user]);

  const onSave = () => {
    setIsModalOpen(false);
    toast.loading(t('processing'));

    axios
      .put(
        endpoint('/api/v1/users/:id?include=company_user', { id: user.id }),
        userState.changes,
        {
          headers: { 'X-Api-Password': currentPassword, ...defaultHeaders },
        }
      )
      .then((response) => {
        toast.dismiss();
        toast.success(t('updated_settings'));

        dispatch(updateUser(response.data.data));

        window.dispatchEvent(new CustomEvent('user.updated'));
      })
      .catch((error: AxiosError) => {
        toast.dismiss();

        error.response?.status === 412
          ? toast.error(error.response?.data.message)
          : toast.error(t('error_title'));
      })
      .finally(() => dispatch(deletePassword()));
  };

  return (
    <Settings
      onSaveClick={() => setIsModalOpen(true)}
      onCancelClick={() => dispatch(resetChanges())}
      title={t('user_details')}
    >
      <Modal
        onClose={setIsModalOpen}
        visible={isModalOpen}
        title={t('confirmation')}
        text={t('please_enter_your_password')}
      >
        <InputField
          id="current_password"
          type="password"
          label={t('current_password')}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setCurrentPassword(event.target.value)
          }
        />
        <Button onClick={onSave}>{t('continue')}</Button>
      </Modal>

      <div className="space-y-6 mt-6">
        <Details />
        <Password />
        <Connect />
        <TwoFactorAuthentication />
        <AccentColor />
        <Notifications />
      </div>
    </Settings>
  );
}
