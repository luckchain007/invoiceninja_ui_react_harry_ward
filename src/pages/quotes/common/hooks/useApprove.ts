/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from "common/helpers";
import { request } from "common/helpers/request";
import { toast } from "common/helpers/toast/toast";
import { Quote } from "common/interfaces/quote";
import { useQueryClient } from "react-query";
import { generatePath } from "react-router-dom";

export function useApprove() {
  const queryClient = useQueryClient();

  return (quote: Quote) => {
    toast.processing();

    request(
      "PUT",
      endpoint("/api/v1/quotes/:id?approve=true", { id: quote.id }),
      quote,
    )
      .then(() => {
        toast.success("approved_quote");

        queryClient.invalidateQueries(
          generatePath("/api/v1/quotes/:id", { id: quote.id }),
        );

        queryClient.invalidateQueries("/api/v1/quotes");
      })
      .catch((error) => {
        toast.error();

        console.error(error);
      });
  };
}
