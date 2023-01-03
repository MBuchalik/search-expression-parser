import classNames from 'classnames';
import React from 'react';

import styles from './round-icon-button.module.scss';

interface Props {
  icon: React.ReactElement;
  disabled?: boolean;
  onClick: () => void;
}
export const RoundIconButton: React.FC<Props> = (props) => {
  return (
    <button
      type="button"
      className={classNames(
        'text-white',
        'focus:outline-gray-800',
        'p-2',
        'rounded-full',
        styles.button,
      )}
      disabled={props.disabled}
      onClick={(): void => props.onClick()}
    >
      {props.icon}
    </button>
  );
};
