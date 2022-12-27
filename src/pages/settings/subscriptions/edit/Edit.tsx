/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { route } from 'common/helpers/route';
import { toast } from 'common/helpers/toast/toast';
import { Product } from 'common/interfaces/product';
import { Subscription } from 'common/interfaces/subscription';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { useProductsQuery } from 'common/queries/products';
import { Settings } from 'components/layouts/Settings';
import { TabGroup } from 'components/TabGroup';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Overview } from '../common/components/Overview';
import { Settings as SubscriptionSettings } from '../common/components/Settings';
import { Webhook } from '../common/components/Webhook';
import { useBlankSubscriptionQuery } from '../common/hooks/useBlankSubscriptionQuery';
import { useHandleChange } from '../common/hooks/useHandleChange';

export function Edit() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();

  const { data } = useBlankSubscriptionQuery();

  const { data: productsData } = useProductsQuery();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('subscriptions'), href: '/settings/subscriptions' },
    {
      name: t('edit_subscription'),
      href: route('/settings/subscriptions/:id/edit', { id }),
    },
  ];

  const tabs = [t('overview'), t('settings'), t('webhook')];

  const [subscription, setSubscription] = useState<Subscription>();

  const [products, setProducts] = useState<Product[]>();

  const [errors, setErrors] = useState<ValidationBag>();

  const handleChange = useHandleChange({
    setErrors,
    setSubscription,
    subscription,
  });

  useEffect(() => {
    if (data) {
      setSubscription({
        ...data,
        frequency_id: '5',
        webhook_configuration: {
          post_purchase_headers: {},
          post_purchase_body: '',
          post_purchase_rest_method: '',
          post_purchase_url: '',
          return_url: '',
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
    }
  }, [productsData]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors(undefined);
    toast.processing();

    request('POST', endpoint('/api/v1/subscriptions'), subscription)
      .then((response) => {
        console.log(response);
        toast.success('created_subscription');
        //navigate('/transactions');
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        } else {
          console.error(error);
          toast.error();
        }
      });
  };

  return (
    <Settings
      title={t('new_subscription')}
      breadcrumbs={pages}
      onSaveClick={handleSave}
      onCancelClick={() => navigate('/settings/subscriptions')}
      disableSaveButton={!subscription}
    >
      <TabGroup tabs={tabs}>
        <div>
          {subscription && (
            <Overview
              subscription={subscription}
              handleChange={handleChange}
              errors={errors}
              products={products}
            />
          )}
        </div>

        <div>
          {subscription && (
            <SubscriptionSettings
              subscription={subscription}
              handleChange={handleChange}
              errors={errors}
            />
          )}
        </div>

        <div>
          {subscription && (
            <Webhook
              subscription={subscription}
              handleChange={handleChange}
              errors={errors}
            />
          )}
        </div>
      </TabGroup>
    </Settings>
  );
}
