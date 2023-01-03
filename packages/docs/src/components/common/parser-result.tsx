import json5 from 'json5';
import React from 'react';
import { parse } from 'search-expression-parser';

import { CodeViewer } from './code-viewer';

interface Props {
  query: string;
}
export const ParserResult: React.FC<Props> = (props) => {
  const controller = useController(props);

  return <CodeViewer code={controller.state.parserResult} />;
};

interface State {
  parserResult: string;
}
interface Controller {
  state: State;
}
function useController(props: Props): Controller {
  const [state, setState] = React.useState<State>({
    parserResult: '',
  });

  React.useEffect(() => {
    const DEBOUNCE_TIMEOUT_MILLIS = 300;

    const debounceTimeout = window.setTimeout(() => {
      const parserResult = parse(props.query);

      const formattedParserResult = json5.stringify(parserResult, undefined, 2);

      const resultWithPrefix = `const parserResult = ${formattedParserResult};`;

      setState((state) => ({ ...state, parserResult: resultWithPrefix }));
    }, DEBOUNCE_TIMEOUT_MILLIS);

    return (): void => {
      window.clearTimeout(debounceTimeout);
    };
  }, [props.query]);

  return {
    state: state,
  };
}
