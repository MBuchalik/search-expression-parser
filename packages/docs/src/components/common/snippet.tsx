import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { merge } from '../../utils/merge';

import { RoundIconButton } from './round-icon-button';

interface Props {
  snippet: string;
}
export const Snippet: React.FC<Props> = (props) => {
  const controller = useController(props);

  return (
    <div className="flex flex-row items-center gap-6 rounded-[10px] border-[3px] border-neutral-300 bg-neutral-100 px-4 py-2">
      <div className="flex-grow select-all font-mono">{props.snippet}</div>

      <div className="flex-shrink-0">
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
      setState((state) => merge(state, { showCopyToClipboardFeedback: true }));
      window.setTimeout(() => {
        setState((state) =>
          merge(state, { showCopyToClipboardFeedback: false }),
        );
      }, CONFIRMATION_DURATION);

      void navigator.clipboard.writeText(props.snippet);
    },
  };
}
