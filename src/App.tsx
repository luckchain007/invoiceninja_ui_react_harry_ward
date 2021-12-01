/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { routes } from './common/routes';
import { RootState } from './common/stores/store';

export function App() {
  let darkMode = useSelector((state: RootState) => state.settings.darkMode);

  useEffect(() => {
    darkMode
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark');
  }, [darkMode]);

  return <div className="App">{routes}</div>;
}
