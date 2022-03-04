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
import { SelectField, Textarea } from '@invoiceninja/forms';
import { useStaticsQuery } from 'common/queries/statics';
import { useTranslation } from 'react-i18next';

type Props = { data?: any; onChange?: any; formikUpdateField?: any };

export function AdditionalInfo(props: Props) {
  const [t] = useTranslation();
  const { data: statics } = useStaticsQuery();

  return (
    <Card title={t('additional_info')} className="mb-5">
      <Element leftSide={t('currency')}>
        <SelectField
          onChange={(event: any) => {
            props.formikUpdateField('currency_id', event.target.value);
          }}
        >
          {statics?.data.currencies.map((element: any, index: any) => {
            if (element.id === props.data.currency_id) {
              return (
                <option value={element.id} key={index} selected>
                  {element.name}
                </option>
              );
            } else
              return (
                <option value={element.id} key={index}>
                  {element.name}
                </option>
              );
          })}
        </SelectField>
      </Element>
      <Element leftSide={t('public_notes')}>
        <Textarea
          id="public_notes"
          onChange={props.onChange}
          value={props.data.public_notes}
        ></Textarea>
      </Element>
      <Element leftSide={t('private_notes')}>
        <Textarea
          id="private_notes"
          onChange={props.onChange}
          value={props.data.private_notes}
        ></Textarea>
      </Element>
    </Card>
  );
}
