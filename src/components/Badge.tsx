/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import { useAccentColor } from 'common/hooks/useAccentColor';
import CommonProps from '../common/interfaces/common-props.interface';

interface Props extends CommonProps {
  variant?: 'primary' | 'white' | 'yellow' | 'red' | 'generic';
}

const defaultProps: Props = {
  variant: 'generic',
};

export function Badge(props: Props) {
  props = { ...defaultProps, ...props };

  const accentColor = useAccentColor();

  const styles: React.CSSProperties = {};

  if (props.variant === 'primary') {
    styles.backgroundColor = accentColor;
    styles.color = 'white';
  }

  return (
    <span
      style={styles}
      className={classNames('text-xs px-2 py-1 rounded', {
        'bg-gray-50': props.variant === 'generic',
        'bg-white border': props.variant === 'white',
        'bg-yellow-600 text-white': props.variant === 'yellow',
        'bg-red-600 text-white': props.variant === 'red',
      })}
    >
      {props.children}
    </span>
  );
}
