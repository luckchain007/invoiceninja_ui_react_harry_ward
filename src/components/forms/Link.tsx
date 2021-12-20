/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import CommonProps from '../../common/interfaces/common-props.interface';
import { RootState } from '../../common/stores/store';

interface Props extends CommonProps {
  to: string;
  children: ReactNode;
  external?: boolean;
}

export function Link(props: Props) {
  const colors = useSelector((state: RootState) => state.settings.colors);
  const css: React.CSSProperties = {
    color: colors.primary,
  };

  if (props.external) {
    return (
      <a
        target="_blank"
        href={props.to}
        className={`text-sm hover:underline ${props.className}`}
        style={css}
      >
        {props.children}
      </a>
    );
  }

  return (
    <RouterLink
      className={`text-sm hover:underline ${props.className}`}
      style={css}
      to={props.to}
    >
      {props.children}
    </RouterLink>
  );
}
