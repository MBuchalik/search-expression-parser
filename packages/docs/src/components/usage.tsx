import classNames from 'classnames';
import React from 'react';

import { CodeViewer } from './common/code-viewer';

const CODE_SAMPLE_SIMPLE = `import { parse } from 'search-expression-parser';

const mySearchExpression = 'name:john AND age:50';
const parsedSearchExpression = parse(mySearchExpression);

if (parsedSearchExpression.success) {
  console.log('Success!', parsedSearchExpression);
} else {
  console.error('Something went wrong...');
}
`;

const CODE_SAMPLE_FILTERING = `import { filter } from 'search-expression-parser';

// ...

function filterMyData(parsedSearchExpression) {
  const myData = [1, 2, 3, 4];
  
  const filteredData = filter(myData, parsedSearchExpression, dataMatcher);

  console.log(filteredData);
}
function dataMatcher(expressionNode, item) {
  /*
    Depending on the data in the node, we can perform filtering.
    
    In this example, we want to allow queries that look like this:
    num:1 OR num:2 OR NOT num:5

    The DataMatcher function may get called on two types of nodes:
    - Key-Value nodes like “name:bob”
    - Value-Only nodes like “bob”

    In this example, we want to treat Value-Only nodes as invalid (i.e. as a syntax error).
    Also, we want to treat keys of a Key-Value node as a syntax error 
    if the key is not “num”.
  */

  // No Key-Value node? Treat this as a syntax error!
  if (expressionNode.type !== 'KEY-VALUE') {
    return {
      success: false,
      error: 'The query is invalid! We only allow Key-Value pairs.',
    }
  }

  // The key is not “num”? Treat this as a syntax error!
  if (expressionNode.key.value !== 'num') {
    return {
      success: false,
      error: 'The query is invalid! We only allow Key-Value pairs where the key is "num".',
    }
  }

  if (Number.parseInt(expressionNode.value.value, 10) === item) {
    return {
      success: true,
      data: {
        isMatching: true,
      }
    }
  }

  return {
    success: true,
    data: {
      isMatching: false,
    }
  }
}
`;

export const Usage: React.FC = () => {
  return (
    <div>
      <h2
        className={classNames('font-bold', 'text-[1.75rem]', 'tracking-wider')}
      >
        Usage
      </h2>

      <div className={classNames('my-4')}>
        The following parses a search expression and logs the result to the
        console:
      </div>

      <div>
        <CodeViewer code={CODE_SAMPLE_SIMPLE} />
      </div>

      <div className={classNames('my-4')}>
        Often, search-expression-parser is used to filter elements from an
        array. To do this, you could either manually traverse the parsed search
        expression. Or, simply use the built-in helper function for this:
      </div>

      <div>
        <CodeViewer code={CODE_SAMPLE_FILTERING} />
      </div>
    </div>
  );
};
