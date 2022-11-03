/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentCompanyDateFormats } from 'common/hooks/useCurrentCompanyDateFormats';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { date as formatDate } from 'common/helpers';
import { TotalColors } from './Totals';

type Props = {
  data: {
    invoices: { total: string; date: string; currency: string }[];
    payments: { total: string; date: string; currency: string }[];
    expenses: {
      total: string;
      date: string;
      currency: string;
    }[];
  };
  dates: any;
  chartSensitivity: 'day' | 'week' | 'month';
};

export function Chart(props: Props) {
  const [t] = useTranslation();
  const [chartData, setchartData] = useState<unknown[]>([]);

  const { dateFormat } = useCurrentCompanyDateFormats();

  useEffect(() => {
    const completeChartData: {
      name: string;
      invoices: number;
      expenses: number;
      payments: number;
    }[] = [];

    switch (props.chartSensitivity) {
      case 'day': {
        for (
          let date = new Date(props.dates.start_date);
          date < new Date(props.dates.end_date);
          date.setDate(date.getDate() + 1)
        ) {
          completeChartData.push({
            name: formatDate(date.toString(), dateFormat),
            invoices: 0,
            expenses: 0,
            payments: 0,
          });
        }
        break;
      }
      case 'week': {
        for (
          let date = new Date(props.dates.start_date);
          date < new Date(props.dates.end_date);
          date.setDate(date.getDate() + 7)
        ) {
          completeChartData.push({
            name: formatDate(date.toString(), dateFormat),
            invoices: 0,
            expenses: 0,
            payments: 0,
          });
        }
        break;
      }
      case 'month': {
        for (
          let date = new Date(props.dates.start_date);
          date < new Date(props.dates.end_date);
          date.setDate(date.getDate() + 30)
        ) {
          completeChartData.push({
            name: formatDate(date.toString(), dateFormat),
            invoices: 0,
            expenses: 0,
            payments: 0,
          });
        }
        break;
      }
    }

    props.data?.expenses.forEach((item) => {
      let itemAdded = false;
      completeChartData.forEach((element) => {
        if (element.name === item.date) {
          element.expenses = parseFloat(item.total);
          itemAdded = true;
        }
      });
      if (!itemAdded) {
        completeChartData.push({
          name: item.date,
          invoices: 0,
          expenses: parseFloat(item.total),
          payments: 0,
        });
      }
    });
    props.data?.payments.forEach((item) => {
      let itemAdded = false;

      completeChartData.forEach((element) => {
        if (element.name === item.date) {
          element.payments = parseFloat(item.total);
          itemAdded = true;
        }
      });

      if (!itemAdded) {
        completeChartData.push({
          name: item.date,
          invoices: 0,
          expenses: 0,
          payments: parseFloat(item.total),
        });
      }
    });
    props.data?.invoices.forEach((item) => {
      let itemAdded = false;

      completeChartData.forEach((element) => {
        if (element.name === item.date) {
          element.invoices = parseFloat(item.total);
          itemAdded = true;
        }
      });
      if (!itemAdded) {
        completeChartData.push({
          name: item.date,
          invoices: parseFloat(item.total),
          expenses: 0,
          payments: 0,
        });
      }
    });

    completeChartData.sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
    setchartData(completeChartData);
  }, [props]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart height={200} data={chartData}>
        <Legend />
        <defs>
          <Line id="payments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={TotalColors.Green} stopOpacity={0.8} />
            <stop offset="95%" stopColor={TotalColors.Green} stopOpacity={0} />
          </Line>
          <Line id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={TotalColors.Red} stopOpacity={0.8} />
            <stop offset="95%" stopColor={TotalColors.Red} stopOpacity={0} />
          </Line>
          <Line id="invoices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={TotalColors.Blue} stopOpacity={0.8} />
            <stop offset="95%" stopColor={TotalColors.Blue} stopOpacity={0} />
          </Line>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />

        <XAxis height={50} dataKey="name" />
        <YAxis />
        <Area
          name={t('invoices')}
          dataKey="invoices"
          stroke={TotalColors.Blue}
          fill="url(#invoices)"
          fillOpacity={1}
        />
        <Area
          name={t('payments')}
          dataKey="payments"
          stroke={TotalColors.Red}
          fill="url(#payments)"
          fillOpacity={1}
        />
        <Area
          name={t('expenses')}
          dataKey="expenses"
          stroke={TotalColors.Green}
          fill="url(#expenses)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
