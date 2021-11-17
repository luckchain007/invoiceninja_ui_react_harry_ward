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
import { Default } from "../components/layouts/Default";

export function Products() {
  const [t] = useTranslation();

  useEffect(() => {
    document.title = t("projects");
  });

  return <Default title={t("projects")}>Lorem, ipsum dolor.</Default>;
}
