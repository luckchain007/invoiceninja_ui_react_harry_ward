/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React from 'react';
import { Route, Routes } from 'react-router';
import { HostedRoute } from '../components/HostedRoute';
import { PrivateRoute } from '../components/PrivateRoute';
import { PublicRoute } from '../components/PublicRoute';
import { Index } from '../pages/Index';
import { Dashboard } from '../pages/dashboard/Dashboard';
import {
  Login,
  Logout,
  RecoverPassword,
  Register,
} from '../pages/authentication';
import {
  ProductClone,
  ProductCreate,
  ProductEdit,
  Products,
} from '../pages/products';
import { Invoices, InvoiceCreate } from '../pages/invoices/index';

export const routes = (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/recover_password" element={<RecoverPassword />} />
      <Route element={<HostedRoute />}>
        <Route path="/register" element={<Register />} />
      </Route>
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products">
        <Route path="" element={<Products />} />
        <Route path="create" element={<ProductCreate />} />
        <Route path=":id/edit" element={<ProductEdit />} />
        <Route path=":id/clone" element={<ProductClone />} />
      </Route>
      <Route path="/invoices">
        <Route path="" element={<Invoices />} />
        <Route path="create" element={<InvoiceCreate />} />
      </Route>
      <Route path="/logout" element={<Logout />} />
    </Route>
  </Routes>
);
