/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { deletePassword, updateChanges } from '$app/common/stores/slices/user';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Card, Element } from '../../../../components/cards';
import { InputField } from '../../../../components/forms';

export function Password() {
  const [t] = useTranslation();

  const dispatch = useDispatch();

  const errors: ValidationBag = useOutletContext();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleChange = () => {
    password === passwordConfirmation && password.length > 1
      ? dispatch(updateChanges({ property: 'password', value: password }))
      : dispatch(deletePassword());
  };

  const onUserUpdated = () => {
    setPassword('');
    setPasswordConfirmation('');
  };

  useEffect(() => {
    window.addEventListener('user.updated', onUserUpdated);

    handleChange();
  }, [password, passwordConfirmation]);

  return (
    <Card title={t('password')}>
      <Element leftSide={t('new_password')}>
        <InputField
          value={password}
          id="password"
          type="password"
          onValueChange={(value) => setPassword(value)}
          errorMessage={(errors?.errors?.password ?? [])[0]}
        />
      </Element>
      <Element leftSide={t('confirm_password')}>
        <InputField
          value={passwordConfirmation}
          id="password_confirmation"
          type="password"
          onValueChange={(value) => setPasswordConfirmation(value)}
          errorMessage={(errors?.errors?.password_confirmation ?? [])[0]}
        />
      </Element>
    </Card>
  );
}
