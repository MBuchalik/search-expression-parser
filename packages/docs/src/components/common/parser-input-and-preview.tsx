import React from 'react';

import { FancyInputBox } from './fancy-input-box';
import { ParserResult } from './parser-result';

interface Props {
  initialValue: string;
}
export const ParserInputAndPreview: React.FC<Props> = (props) => {
  const controller = useController(props);

  return (
    <div>
      <FancyInputBox
        initialValue={props.initialValue}
        onChangeValue={(newValue): void => controller.setInputValue(newValue)}
      />

      <ParserResult query={controller.state.inputValue} />
    </div>
  );
};

interface State {
  inputValue: string;
}
interface Controller {
  state: State;

  setInputValue: (value: string) => void;
}
function useController(props: Props): Controller {
  const [state, setState] = React.useState<State>({
    inputValue: props.initialValue,
  });

  return {
    state: state,

    setInputValue: (value): void => {
      setState((state) => ({ ...state, inputValue: value }));
    },
  };
}
