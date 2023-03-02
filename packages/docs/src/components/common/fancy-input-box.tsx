import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';

import { merge } from '../../utils/merge';

import styles from './fancy-input-box.module.scss';
import { RoundIconButton } from './round-icon-button';

interface Props {
  initialValue: string;
  autoFocus?: boolean;

  onChangeValue: (newValue: string) => void;
}
/**
 * Please note that the input field is basically a "one-way" input:
 * It is not possible to control its content from the outside.
 */
export const FancyInputBox: React.FC<Props> = (props) => {
  const controller = useController(props);

  return (
    <div
      className={classNames(
        'flex flex-row items-center gap-6 rounded-[10px] px-4 py-2',
        styles.container,
      )}
    >
      <div className={classNames('flex-grow')}>
        <input
          ref={controller.inputRef}
          type="text"
          className={classNames('w-full bg-transparent p-1 font-mono')}
          value={controller.state.value}
          onChange={(e): void => controller.setValue(e.target.value)}
        />
      </div>

      <div className={classNames('flex-shrink-0')}>
        <RoundIconButton
          icon={<ArrowUturnLeftIcon />}
          disabled={controller.state.value === props.initialValue}
          onClick={(): void => controller.revertChanges()}
        />
      </div>
    </div>
  );
};

interface State {
  value: string;
}
interface Controller {
  state: State;

  inputRef: React.RefObject<HTMLInputElement>;

  setValue: (value: string) => void;
  revertChanges: () => void;
}
function useController(props: Props): Controller {
  const [state, setState] = React.useState<State>({
    value: props.initialValue,
  });

  React.useEffect(() => {
    props.onChangeValue(state.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (props.autoFocus !== true) {
      return;
    }

    // Sometimes, when focusing the input immediately, the cursor is not visible when the content of the input needs to be scrolled (i.e. it "overflows"). Adding a small timeout seems to help.
    window.setTimeout(() => {
      if (!inputRef.current) {
        return;
      }
      const inputLength = state.value.length;
      inputRef.current.setSelectionRange(inputLength, inputLength);
      inputRef.current.focus();
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: state,

    inputRef: inputRef,

    setValue: (newValue): void => {
      setState((state) => merge(state, { value: newValue }));
    },
    revertChanges: (): void => {
      setState((state) => merge(state, { value: props.initialValue }));
    },
  };
}
