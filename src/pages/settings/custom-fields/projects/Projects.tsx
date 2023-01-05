/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from 'common/hooks/useTitle';
import { CustomFieldsPlanAlert } from 'components/CustomFieldsPlanAlert';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../../components/cards';
import { Settings } from '../../../../components/layouts/Settings';
import { Field } from '../components';

export function Projects() {
  const { documentTitle } = useTitle('custom_fields');

  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('custom_fields'), href: '/settings/custom_fields' },
    { name: t('projects'), href: '/settings/custom_fields/projects' },
  ];

  return (
    <Settings
      title={documentTitle}
      breadcrumbs={pages}
      docsLink="docs/advanced-settings/#custom_fields"
    >
      <CustomFieldsPlanAlert />

      <Card title={`${t('custom_fields')}: ${t('projects')}`}>
        {['project1', 'project2', 'project3', 'project4'].map(
          (field, index) => (
            <Field key={index} field={field} placeholder={t('project_field')} />
          )
        )}
      </Card>
    </Settings>
  );
}
