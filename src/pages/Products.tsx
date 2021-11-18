/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../components/forms/Checkbox";
import { Default } from "../components/layouts/Default";
import { useProductsQuery } from "../common/queries/products";
import { Actions } from "./products/Actions";
import { Table, Tbody, Td, Th, Thead, Tr } from "../components/tables/Table";
import { Button } from "../components/forms/Button";
import { TableWrapper } from "../components/tables/TableWrapper";
import { Pagination } from "../components/tables/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "../common/stores/store";
import { Product } from "../common/dtos/product";
import Loading from "../components/icons/Loading";

export function Products() {
  useEffect(() => {
    document.title = t("products");
  });

  const [t] = useTranslation();

  const currentPage = useSelector(
    (state: RootState) => state.products.currentPage
  );

  const { data, isLoading } = useProductsQuery({
    perPage: 10,
    currentPage,
  });

  return (
    <Default title={t("products")}>
      <Actions />
      <TableWrapper>
        <Table>
          <Thead>
            <Th>
              <Checkbox />
            </Th>
            <Th>{t("product")}</Th>
            <Th>{t("notes")}</Th>
            <Th>{t("cost")}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {isLoading && (
              <Tr>
                <Td>
                  <Loading />
                </Td>
              </Tr>
            )}

            {data &&
              data.data.map((product: Product) => (
                <Tr>
                  <Td>
                    <Checkbox />
                  </Td>
                  <Td>{product.product_key}</Td>
                  <Td>{product.notes}</Td>
                  <Td>{product.price}</Td>
                  <Td>
                    <Button variant="secondary">Actions</Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {data?.meta.pagination && data?.meta.pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.meta.pagination.total_pages}
          />
        )}
      </TableWrapper>
    </Default>
  );
}
