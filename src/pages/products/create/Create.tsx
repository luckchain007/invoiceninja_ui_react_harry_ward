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
import { GenericSingleResourceResponse } from 'common/interfaces/generic-api-response';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { useBlankProductQuery } from 'common/queries/products';
import { Container } from 'components/Container';
import { Default } from 'components/layouts/Default';
import { Spinner } from 'components/Spinner';
import { useAtomValue } from 'jotai';
import { ProductTableResource } from 'pages/invoices/common/components/ProductsTable';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { productAtom } from '../common/atoms';
import { CreateProduct } from '../common/components/CreateProduct';

export function Create() {
  const [t] = useTranslation();

  const { data: blankProductData } = useBlankProductQuery();

  const navigate = useNavigate();

  const pages = [
    { name: t('products'), href: '/products' },
    { name: t('new_product'), href: '/products/create' },
  ];

  const product = useAtomValue(productAtom);

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [errors, setErrors] = useState<ValidationBag>();

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/products'), product)
        .then(
          (response: GenericSingleResourceResponse<ProductTableResource>) => {
            toast.success('created_product');

            navigate(
              route('/products/:id/edit', {
                id: response.data.data.id,
              })
            );
          }
        )
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          } else {
            console.log(error);
            toast.error();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  return (
    <Default
      title={t('new_product')}
      breadcrumbs={pages}
      disableSaveButton={!blankProductData || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container>
        {blankProductData?.data.data ? (
          <CreateProduct
            product={blankProductData.data.data}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}
