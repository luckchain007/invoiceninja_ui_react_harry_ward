/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProductsQuery } from "../../common/queries/products";
import { Default } from "../../components/layouts/Default";
import { Link } from "../../components/forms/Link";
import { Table } from "../../components/tables/Table";
import { Thead } from "../../components/tables/Thead";
import { Th } from "../../components/tables/Th";
import { Tbody } from "../../components/tables/Tbody";
import { Tr } from "../../components/tables/Tr";
import { Td } from "../../components/tables/Td";
import { Pagination } from "../../components/tables/Pagination";
import { Checkbox } from "../../components/forms/Checkbox";
import { generatePath } from "react-router";
import { Actions } from "../../components/datatables/Actions";

export function Products() {
  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: ${t("products")}`;
  });

  const [t] = useTranslation();
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState("10");

  const options = [
    { value: "archive", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "deleted", label: "Deleted" },
  ];

  const { data, isLoading } = useProductsQuery({
    perPage,
    currentPage,
    filter,
  });

  return (
    <Default title={t("products")}>
      <Actions />
      <Table>
        <Thead>
          <Th>
            <Checkbox />
          </Th>
          <Th>{t("product")}</Th>
          <Th>{t("notes")}</Th>
          <Th>{t("cost")}</Th>
        </Thead>
        <Tbody>
          {data?.data.map((product: any) => {
            return (
              <Tr key={product.id} isLoading={isLoading}>
                <Td>
                  <Checkbox id={product.id} />
                </Td>
                <Td>
                  <Link
                    to={generatePath("/products/:id/edit", { id: product.id })}
                  >
                    {product.product_key}
                  </Link>
                </Td>
                <Td>{product.notes}</Td>
                <Td>{product.cost}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Pagination
        onRowsChange={setPerPage}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={data?.meta.pagination.total_pages}
      />
    </Default>
  );
}
