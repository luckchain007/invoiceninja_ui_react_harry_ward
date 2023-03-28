/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useTitle } from '$app/common/hooks/useTitle';
import { useDesignsQuery } from '$app/common/queries/designs';
import { Card } from '$app/components/cards';
import { Default } from '$app/components/layouts/Default';
import { TabGroup } from '$app/components/TabGroup';
import { payloadAtom } from '$app/pages/settings/invoice-design/customize/common/hooks';
import { variables } from '$app/pages/settings/invoice-design/customize/common/variables';
import { Body } from '$app/pages/settings/invoice-design/customize/components/Body';
import { Footer } from '$app/pages/settings/invoice-design/customize/components/Footer';
import { Header } from '$app/pages/settings/invoice-design/customize/components/Header';
import { Includes } from '$app/pages/settings/invoice-design/customize/components/Includes';
import { Settings } from '$app/pages/settings/invoice-design/customize/components/Settings';
import { Variable } from '$app/pages/settings/templates-and-reminders/common/components/Variable';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function Customize() {
  const [t] = useTranslation();
  const [payload, setPayload] = useAtom(payloadAtom);

  const { documentTitle } = useTitle('customize_and_preview');
  const { data: designs } = useDesignsQuery();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('invoice_design'), href: '/settings/invoice_design' },
    { name: t('customize_and_preview'), href: '/settings/design/customize' },
  ];

  const company = useInjectCompanyChanges();

  useEffect(() => {
    if (designs && company?.settings) {
      setPayload(
        (current) =>
          current && {
            ...current,
            design: { ...designs[0], id: '-1' },
            settings: company.settings,
          }
      );
    }
  }, [designs]);

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          {/* <TabGroup
            tabs={[
              t('settings'),
              t('body'),
              t('header'),
              t('footer'),
              t('includes'),
            ]}
          >
            <div>
              <Settings payload={payload} />
            </div>

            <div>
              <Body payload={payload} />
            </div>

            <div>
              <Header payload={payload} />
            </div>

            <div>
              <Footer payload={payload} />
            </div>

            <div>
              <Includes payload={payload} />
            </div>
          </TabGroup> */}

          <TabGroup tabs={[t('settings'), t('design'), t('variables')]}>
            <div></div>

            <div className="space-y-4">
              <Settings payload={payload} />
              <Body payload={payload} />
              <Header payload={payload} />
              <Footer payload={payload} />
              <Includes payload={payload} />
            </div>

            <div className="space-y-4">
              <Card
                title={t('invoice')}
                padding="small"
                className="text-sm"
                childrenClassName="px-2"
                collapsed={false}
              >
                <div className="px-2">
                  {variables.invoice.map((variable, index) => (
                    <Variable key={index}>{variable}</Variable>
                  ))}
                </div>
              </Card>

              <Card
                title={t('client')}
                padding="small"
                className="text-sm"
                childrenClassName="px-2"
                collapsed={true}
              >
                <div className="px-2">
                  {variables.client.map((variable, index) => (
                    <Variable key={index}>{variable}</Variable>
                  ))}
                </div>
              </Card>

              <Card
                title={t('contact')}
                padding="small"
                className="text-sm"
                childrenClassName="px-2"
                collapsed={true}
              >
                <div className="px-2">
                  {variables.contact.map((variable, index) => (
                    <Variable key={index}>{variable}</Variable>
                  ))}
                </div>
              </Card>

              <Card
                title={t('company')}
                padding="small"
                className="text-sm"
                childrenClassName="px-2"
                collapsed={true}
              >
                <div className="px-2">
                  {variables.company.map((variable, index) => (
                    <Variable key={index}>{variable}</Variable>
                  ))}
                </div>
              </Card>
            </div>
          </TabGroup>
        </div>

        <div className="col-span-12 lg:col-span-7">
          {/* {payload?.design && (
            <InvoiceViewer
              link={endpoint('/api/v1/preview')}
              resource={payload}
              method="POST"
              withToast
            />
          )} */}
        </div>
      </div>
    </Default>
  );
}
