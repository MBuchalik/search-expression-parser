import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';

import { RoundIconButton } from './round-icon-button';

interface Props {
  snippet: string;
}
export const Snippet: React.FC<Props> = (props) => {
  const controller = useController(props);

  return (
    <div
      className={classNames(
        'flex',
        'flex-row',
        'px-4',
        'py-2',
        'rounded-[10px]',
        'gap-6',
        'items-center',
        'bg-neutral-100',
        'border-neutral-300',
        'border-[3px]',
      )}
    >
      <div className={classNames('flex-grow', 'font-mono', 'select-all')}>
        {props.snippet}
      </div>

      <div className={classNames('flex-shrink-0')}>
        <RoundIconButton
          icon={
            controller.state.showCopyToClipboardFeedback ? (
              <CheckIcon />
            ) : (
              <ClipboardIcon />
            )
          }
          onClick={(): void => {
            controller.copySnippetToClipboard();
          }}
        />
      </div>
    </div>
  );
};

interface State {
  showCopyToClipboardFeedback: boolean;
}
interface Controller {
  state: State;

  copySnippetToClipboard: () => void;
}
function useController(props: Props): Controller {
  const [state, setState] = React.useState<State>({
    showCopyToClipboardFeedback: false,
  });

  return {
    state: state,

    copySnippetToClipboard: (): void => {
      const CONFIRMATION_DURATION = 2000;
      setState((state) => ({ ...state, showCopyToClipboardFeedback: true }));
      window.setTimeout(() => {
        setState((state) => ({ ...state, showCopyToClipboardFeedback: false }));
      }, CONFIRMATION_DURATION);

      void navigator.clipboard.writeText(props.snippet);
    },
  };
}
