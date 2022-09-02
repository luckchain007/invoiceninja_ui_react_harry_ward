/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Credit } from 'common/interfaces/credit';
import { Badge } from 'components/Badge';
import { useTranslation } from 'react-i18next';

interface Props {
  entity: Credit;
}

export function CreditStatus(props: Props) {
  const [t] = useTranslation();

  if (props.entity.is_deleted)
    return <Badge variant="red">{t('deleted')}</Badge>;

  if (props.entity.archived_at)
    return <Badge variant="orange">{t('archived')}</Badge>;

  switch (props.entity.status_id) {
    case '1':
      return <Badge variant="generic">{t('draft')}</Badge>;
    case '2':
      return <Badge variant="light-blue">{t('sent')}</Badge>;
    case '3':
      return <Badge variant="dark-blue">{t('partial')}</Badge>;
    case '4':
      return <Badge variant="green">{t('applied')}</Badge>;
    default:
      return <Badge variant="light-blue">{t('error')}</Badge>;
      break;
  }

  return <></>;
}
