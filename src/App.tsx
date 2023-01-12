/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted } from 'common/helpers';
import { useCurrentAccount } from 'common/hooks/useCurrentAccount';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useCurrentUser } from 'common/hooks/useCurrentUser';
import { useResolveLanguage } from 'common/hooks/useResolveLanguage';
import { PhoneVerificationModal } from 'components/PhoneVerificationModal';
import { CompanyActivityModal } from 'components/CompanyActivityModal';
import { VerifyModal } from 'components/VerifyModal';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { routes } from './common/routes';
import { RootState } from './common/stores/store';

export function App() {
  const { i18n } = useTranslation();

  const company = useCurrentCompany();

  const user = useCurrentUser();

  const location = useLocation();

  const account = useCurrentAccount();

  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const [showCompanyActivityModal, setShowCompanyActivityModal] =
    useState<boolean>(false);

  const [showSmsVerificationModal, setShowSmsVerificationModal] =
    useState<boolean>(false);

  const resolveLanguage = useResolveLanguage();

  const darkMode = useSelector((state: RootState) => state.settings.darkMode);

  const resolvedLanguage = company
    ? resolveLanguage(company.settings.language_id)
    : undefined;

  useEffect(() => {
    document.body.classList.add('bg-gray-50', 'dark:bg-gray-900');

    darkMode
      ? document.querySelector('html')?.classList.add('dark')
      : document.querySelector('html')?.classList.remove('dark');

    if (resolvedLanguage?.locale) {
      if (!i18n.hasResourceBundle(resolvedLanguage.locale, 'translation')) {
        fetch(
          new URL(
            `/src/resources/lang/${resolvedLanguage.locale}/${resolvedLanguage.locale}.json`,
            import.meta.url
          ).href
        )
          .then((response) => response.json())
          .then((response: JSON) => {
            i18n.addResources(resolvedLanguage.locale, 'translation', response);
            i18n.changeLanguage(resolvedLanguage.locale);
          });
      } else {
        i18n.changeLanguage(resolvedLanguage.locale);
      }
    }
  }, [darkMode, resolvedLanguage]);

  useEffect(() => {
    if (user && Object.keys(user).length) {
      setIsEmailVerified(Boolean(user.email_verified_at));
    }
  }, [user]);

  useEffect(() => {
    const modalShown = sessionStorage.getItem('PHONE-VERIFICATION-SHOWN');

    if (company && (modalShown === 'false' || !modalShown)) {
      setShowSmsVerificationModal(!account?.account_sms_verified);

      sessionStorage.setItem('PHONE-VERIFICATION-SHOWN', 'true');
    }
  }, [account]);

  useEffect(() => {
    const modalShown = sessionStorage.getItem('COMPANY-ACTIVITY-SHOWN');

    if (company && (modalShown === 'false' || !modalShown)) {
      setShowCompanyActivityModal(company.is_disabled);

      sessionStorage.setItem('COMPANY-ACTIVITY-SHOWN', 'true');
    }
  }, [company]);

  return (
    <div className="App">
      <VerifyModal
        visible={
          !location.pathname.startsWith('/login') &&
          !location.pathname.startsWith('/register') &&
          !isEmailVerified &&
          isHosted()
        }
        type="email"
      />

      <PhoneVerificationModal
        visible={Boolean(account) && showSmsVerificationModal && isHosted()}
        setVisible={setShowSmsVerificationModal}
      />

      <CompanyActivityModal
        visible={Boolean(company) && showCompanyActivityModal}
        setVisible={setShowCompanyActivityModal}
      />

      <Toaster position="top-center" />

      {routes}
    </div>
  );
}
