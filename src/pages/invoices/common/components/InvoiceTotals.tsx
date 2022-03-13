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
import { useResolveTotalVariable } from '../hooks/useResolveTotalVariable';
import { useResolveTranslation } from '../hooks/useResolveTranslation';
import { useTotalVariables } from '../hooks/useTotalVariables';

export function InvoiceTotals() {
  const variables = useTotalVariables();
  const resolveVariable = useResolveTotalVariable();


  return (
    <Card className="col-span-12 xl:col-span-4 h-max">
      {variables.map((variable, index) => resolveVariable(variable))}
    </Card>
  );
}
