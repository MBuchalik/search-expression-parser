import classNames from 'classnames';
import React from 'react';

import { merge } from '../utils/merge';

import { FancyInputBox } from './common/fancy-input-box';
import { ParserResult } from './common/parser-result';
import styles from './hero-content.module.scss';

export const HeroContent: React.FC = () => {
  const controller = useController();

  return (
    <div>
      <div>
        <h1
          className={classNames(
            'inline font-mono text-4xl font-bold',
            styles.fancyHeading,
          )}
        >
          search-expression-parser
        </h1>
      </div>

      <div className={classNames('my-4 font-bold')}>
        Turn a search expression like this:
      </div>

      <div>
        <FancyInputBox
          initialValue='is:archived AND (tag:production OR tag:dev AND NOT author:"John Doe")'
          autoFocus
          onChangeValue={(newValue): void => controller.setInputValue(newValue)}
        />
      </div>

      <div className={classNames('my-4 font-bold')}>
        ...into an easily processable tree structure like this:
      </div>

      <div>
        <ParserResult query={controller.state.inputValue} />
      </div>
    </div>
  );
};

interface State {
  inputValue: string;
}
interface Controller {
  state: State;

  /**
   * Please note that this does **not** change the value shown in the input field itself.
   * The input field is basically a "one-way" input: It is not possible to control its content from the outside.
   */
  setInputValue: (value: string) => void;
}
function useController(): Controller {
  const [state, setState] = React.useState<State>({
    inputValue: '',
  });

  return {
    state: state,

    setInputValue: (value): void => {
      setState((state) => merge(state, { inputValue: value }));
    },
  };
}
