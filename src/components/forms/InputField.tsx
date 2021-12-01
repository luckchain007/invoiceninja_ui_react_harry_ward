/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import CommonProps from '../../common/interfaces/common-props.interface';
import { RootState } from '../../common/stores/store';
import { InputLabel } from './InputLabel';

interface Props extends CommonProps {
  label?: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  border?: boolean;
}

export function InputField(props: Props) {
  const colors = useSelector((state: RootState) => state.settings.colors);

  return (
    <section>
      {props.label && (
        <InputLabel className="mb-2" for={props.id}>
          {props.label}
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </InputLabel>
      )}

      <input
        required={props.required}
        id={props.id}
        type={props.type}
        className={classNames(
          `w-full py-2 px-3 rounded text-sm dark:bg-gray-800 dark:border-transparent dark:text-gray-100 ${props.className}`,
          {
            'border border-gray-300': props.border !== false,
          }
        )}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      />
    </section>
  );
}
