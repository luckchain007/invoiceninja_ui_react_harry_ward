/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '@invoiceninja/cards';
import { InputField, SelectField } from '@invoiceninja/forms';
import { useStaticsQuery } from 'common/queries/statics';
import { useTranslation } from 'react-i18next';

type Props = { data?: any; onChange?: any; formikUpdateField?: any };

export function Address(props: Props) {
  const [t] = useTranslation();
  const { data: statics } = useStaticsQuery();

  return (
    <Card title={t('address')} className="mb-5">
      <Element leftSide={t('address1')}>
        <InputField
          id="address1"
          onChange={props.onChange}
          value={props.data.address1}
        />
      </Element>
      <Element leftSide={t('address2')}>
        <InputField
          id="address2"
          onChange={props.onChange}
          value={props.data.address2}
        />
      </Element>
      <Element leftSide={t('city')}>
        <InputField
          id="city"
          onChange={props.onChange}
          value={props.data.city}
        />
      </Element>
      <Element leftSide={t('state')}>
        <InputField
          id="state"
          onChange={props.onChange}
          value={props.data.state}
        />
      </Element>
      <Element leftSide={t('postal_code')}>
        <InputField
          id="postal_code"
          onChange={props.onChange}
          value={props.data.postal_code}
        />
      </Element>
      <Element leftSide={t('country_id')}>
        <SelectField
          onChange={(event: any) => {
            props.formikUpdateField('country_id', event.target.value);
          }}
        >
          {statics?.data.countries.map((element: any, index: any) => {
            if (element.id === props.data.country_id) {
              return (
                <option value={element.id} key={index} selected>
                  {element.full_name}
                </option>
              );
            } else
              return (
                <option value={element.id} key={index}>
                  {element.full_name}
                </option>
              );
          })}
        </SelectField>
      </Element>
    </Card>
  );
}
