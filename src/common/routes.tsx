/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Route, Routes } from 'react-router';
import { PrivateRoute } from '../components/PrivateRoute';
import { Index } from '../pages/Index';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { invoiceRoutes } from 'pages/invoices/routes';
import { clientRoutes } from 'pages/clients/routes';
import { productRoutes } from 'pages/products/routes';
import { recurringInvoiceRoutes } from 'pages/recurring-invoices/routes';
import { paymentRoutes } from 'pages/payments/routes';
import { settingsRoutes } from 'pages/settings/routes';
import { authenticationRoutes } from 'pages/authentication/routes';

export const routes = (
  <Routes>
    <Route path="/" element={<Index />} />
    {authenticationRoutes}
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      {invoiceRoutes}
      {clientRoutes}
      {productRoutes}
      {recurringInvoiceRoutes}
      {paymentRoutes}
      {settingsRoutes}
    </Route>
  </Routes>
);
