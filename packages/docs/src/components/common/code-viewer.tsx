import { javascript } from '@codemirror/lang-javascript';
import { foldGutter } from '@codemirror/language';
import { EditorState, Extension } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import classNames from 'classnames';
import { EditorView, minimalSetup } from 'codemirror';
import React from 'react';

interface Props {
  code: string;
}
export const CodeViewer: React.FC<Props> = (props) => {
  const controller = useController(props);

  return (
    <div className={classNames('max-h-[500px] overflow-auto')}>
      <div ref={controller.containerRef}></div>
    </div>
  );
};

interface Controller {
  containerRef: React.RefObject<HTMLDivElement>;
}
function useController(props: Props): Controller {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const extensions: Extension[] = [
      minimalSetup,
      lineNumbers(),
      foldGutter(),
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
      EditorView.lineWrapping,
      javascript(),
    ];

    const view = new EditorView({
      doc: props.code,
      extensions: extensions,
      parent: containerRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [props.code]);

  return {
    containerRef: containerRef,
  };
}
