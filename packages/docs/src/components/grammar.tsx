import React from 'react';

import { ParserInputAndPreview } from './common/parser-input-and-preview';

export const Grammar: React.FC = () => {
  return (
    <div>
      <h2 className="text-[1.75rem] font-bold tracking-wider">Grammar</h2>

      <div className="my-4">
        Search expressions are pretty versatile. In the following, you can find
        a list of examples that show the possible search expressions. The
        examples are interactive, so you can always make changes to them if you
        like!
      </div>

      <GrammarSample title="One simple value" query="archived" />

      <GrammarSample title="One key-value pair" query="name:john" />

      <GrammarSample
        title="A key without a value"
        description="When building features like auto-completion or suggestions, it is important that the parser does not simply error out if a value is missing after the colon. That's why search-expression-parser allows empty values after a colon."
        query="name:"
      />

      <GrammarSample title="Text with spaces" query='name:"John Doe"' />

      <GrammarSample
        title="Complex boolean expression"
        query="name:john AND (status:active_user OR tag:important_user AND NOT country:de)"
      />
    </div>
  );
};

interface GrammarSampleProps {
  title: string;
  description?: string;

  query: string;
}
const GrammarSample: React.FC<GrammarSampleProps> = (props) => {
  return (
    <div className="my-8">
      <h3 className="mb-2 text-2xl font-medium">{props.title}</h3>

      {props.description !== undefined && (
        <div className="mb-4">{props.description}</div>
      )}

      <ParserInputAndPreview initialValue={props.query} />
    </div>
  );
};
