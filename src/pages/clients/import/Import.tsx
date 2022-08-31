/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
import { UploadImport } from 'components/import/UploadImport';
import { Default } from 'components/layouts/Default';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

export function Import() {

  const [t] = useTranslation();

 return (

    <Default
      title={t('import')}
      onBackClick={generatePath('/clients')}
    >

      <UploadImport entity={'client'} onSuccess={false} type={'csv'}/>

    </Default>

    
  );
}