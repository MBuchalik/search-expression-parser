import classNames from 'classnames';
import React from 'react';

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
        'box-content h-5 w-5 rounded-full bg-[#ff098e] p-2 text-white focus:outline-gray-800 enabled:hover:bg-[#ff3da6] disabled:opacity-20',
      )}
      disabled={props.disabled}
      onClick={(): void => props.onClick()}
    >
      {props.icon}
    </button>
  );
};
