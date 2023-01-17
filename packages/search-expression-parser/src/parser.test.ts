import { ExpressionNode, ExpressionNodeType } from './models';
import { parse } from './parser';

interface TestExpectedToSucceed {
  testDescription: string;
  query: string;
  expectedResult: ExpressionNode;
}

const TESTS_EXPECTED_TO_SUCCEED: TestExpectedToSucceed[] = [
  {
    testDescription: 'should parse a simple value',
    query: 'name',
    expectedResult: {
      type: ExpressionNodeType.Value,
      range: [0, 4],
      value: {
        range: [0, 4],
        content: 'name',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should parse a single key-value pair',
    query: 'name:john',
    expectedResult: {
      type: ExpressionNodeType.KeyValue,
      range: [0, 9],
      key: {
        range: [0, 4],
        content: 'name',
        hasQuotes: false,
      },
      value: {
        range: [5, 9],
        content: 'john',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should allow whitespace in quotes',
    query: '"the name":"john doe"',
    expectedResult: {
      type: ExpressionNodeType.KeyValue,
      range: [0, 21],
      key: {
        range: [0, 10],
        content: 'the name',
        hasQuotes: true,
        rangeWithoutQuotes: [1, 9],
      },
      value: {
        range: [11, 21],
        content: 'john doe',
        hasQuotes: true,
        rangeWithoutQuotes: [12, 20],
      },
    },
  },
  {
    testDescription: 'should allow special characters',
    query: 'query:foo-_*&baz',
    expectedResult: {
      type: ExpressionNodeType.KeyValue,
      range: [0, 16],
      key: {
        range: [0, 5],
        content: 'query',
        hasQuotes: false,
      },
      value: {
        range: [6, 16],
        content: 'foo-_*&baz',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should allow (useless) brackets',
    query: '((john))',
    expectedResult: {
      type: ExpressionNodeType.Value,
      range: [2, 6],
      value: {
        range: [2, 6],
        content: 'john',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should allow a key with an empty value',
    query: 'name:',
    expectedResult: {
      type: ExpressionNodeType.KeyValue,
      range: [0, 5],
      key: {
        range: [0, 4],
        content: 'name',
        hasQuotes: false,
      },
      value: {
        range: [5, 5],
        content: '',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should treat a lowercase "AND" like an uppercase one',
    query: 'name:john and status:active_user',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 32],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [14, 32],
        key: {
          range: [14, 20],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [21, 32],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should properly treat an explicit "AND"',
    query: 'name:john AND status:active_user',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 32],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [14, 32],
        key: {
          range: [14, 20],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [21, 32],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should properly treat an implicit "AND"',
    query: 'name:john status:active_user',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 28],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [10, 28],
        key: {
          range: [10, 16],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [17, 28],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription:
      'should properly treat an implicit "AND" with empty values',
    query: 'name: status:',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 13],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 5],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 5],
          content: '',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [6, 13],
        key: {
          range: [6, 12],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [13, 13],
          content: '',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should properly treat an "OR"',
    query: 'name:john OR status:active_user',
    expectedResult: {
      type: ExpressionNodeType.Or,
      range: [0, 31],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [13, 31],
        key: {
          range: [13, 19],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [20, 31],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should properly treat a "NOT"',
    query: 'NOT name:john',
    expectedResult: {
      type: ExpressionNodeType.Not,
      range: [0, 13],
      child: {
        type: ExpressionNodeType.KeyValue,
        range: [4, 13],
        key: {
          range: [4, 8],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [9, 13],
          content: 'john',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should bind "NOT" tighter than "AND"',
    query: 'NOT name:john AND status:active_user',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 36],
      leftChild: {
        type: ExpressionNodeType.Not,
        range: [0, 13],
        child: {
          type: ExpressionNodeType.KeyValue,
          range: [4, 13],
          key: {
            range: [4, 8],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [9, 13],
            content: 'john',
            hasQuotes: false,
          },
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [18, 36],
        key: {
          range: [18, 24],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [25, 36],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },
  {
    testDescription: 'should bind "AND" tighter than "OR"',
    query: 'name:john OR name:bob AND status:active_user',
    expectedResult: {
      type: ExpressionNodeType.Or,
      range: [0, 44],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.And,
        range: [13, 44],
        leftChild: {
          type: ExpressionNodeType.KeyValue,
          range: [13, 21],
          key: {
            range: [13, 17],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [18, 21],
            content: 'bob',
            hasQuotes: false,
          },
        },
        rightChild: {
          type: ExpressionNodeType.KeyValue,
          range: [26, 44],
          key: {
            range: [26, 32],
            content: 'status',
            hasQuotes: false,
          },
          value: {
            range: [33, 44],
            content: 'active_user',
            hasQuotes: false,
          },
        },
      },
    },
  },
  {
    testDescription: 'should bind an implicit "AND" tighter than "OR"',
    query: 'name:john OR name:bob status:active_user',
    expectedResult: {
      type: ExpressionNodeType.Or,
      range: [0, 40],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [0, 9],
        key: {
          range: [0, 4],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [5, 9],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.And,
        range: [13, 40],
        leftChild: {
          type: ExpressionNodeType.KeyValue,
          range: [13, 21],
          key: {
            range: [13, 17],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [18, 21],
            content: 'bob',
            hasQuotes: false,
          },
        },
        rightChild: {
          type: ExpressionNodeType.KeyValue,
          range: [22, 40],
          key: {
            range: [22, 28],
            content: 'status',
            hasQuotes: false,
          },
          value: {
            range: [29, 40],
            content: 'active_user',
            hasQuotes: false,
          },
        },
      },
    },
  },
  {
    testDescription:
      'should properly handle brackets to explicitly define the operator precedence',
    query: '(name:john OR name:bob) AND status:active_user',
    expectedResult: {
      type: ExpressionNodeType.And,
      range: [0, 46],
      leftChild: {
        type: ExpressionNodeType.Or,
        range: [1, 22],
        leftChild: {
          type: ExpressionNodeType.KeyValue,
          range: [1, 10],
          key: {
            range: [1, 5],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [6, 10],
            content: 'john',
            hasQuotes: false,
          },
        },
        rightChild: {
          type: ExpressionNodeType.KeyValue,
          range: [14, 22],
          key: {
            range: [14, 18],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [19, 22],
            content: 'bob',
            hasQuotes: false,
          },
        },
      },
      rightChild: {
        type: ExpressionNodeType.KeyValue,
        range: [28, 46],
        key: {
          range: [28, 34],
          content: 'status',
          hasQuotes: false,
        },
        value: {
          range: [35, 46],
          content: 'active_user',
          hasQuotes: false,
        },
      },
    },
  },

  // Tests regarding reserved keywords.
  {
    testDescription:
      'should treat a word starting with "NOT" as a regular word',
    query: 'NOTname',
    expectedResult: {
      type: ExpressionNodeType.Value,
      range: [0, 7],
      value: {
        range: [0, 7],
        content: 'NOTname',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription:
      'should treat a word starting with "AND" as a regular word',
    query: 'ANDname',
    expectedResult: {
      type: ExpressionNodeType.Value,
      range: [0, 7],
      value: {
        range: [0, 7],
        content: 'ANDname',
        hasQuotes: false,
      },
    },
  },
  {
    testDescription: 'should treat a word starting with "OR" as a regular word',
    query: 'ORname',
    expectedResult: {
      type: ExpressionNodeType.Value,
      range: [0, 6],
      value: {
        range: [0, 6],
        content: 'ORname',
        hasQuotes: false,
      },
    },
  },

  // Tests regarding additional spaces and the like.
  {
    testDescription: 'should successfully parse if there are additional spaces',
    query: ' name:john  OR  name:bob    status:active_user ',
    expectedResult: {
      type: ExpressionNodeType.Or,
      range: [1, 46],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [1, 10],
        key: {
          range: [1, 5],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [6, 10],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.And,
        range: [16, 46],
        leftChild: {
          type: ExpressionNodeType.KeyValue,
          range: [16, 24],
          key: {
            range: [16, 20],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [21, 24],
            content: 'bob',
            hasQuotes: false,
          },
        },
        rightChild: {
          type: ExpressionNodeType.KeyValue,
          range: [28, 46],
          key: {
            range: [28, 34],
            content: 'status',
            hasQuotes: false,
          },
          value: {
            range: [35, 46],
            content: 'active_user',
            hasQuotes: false,
          },
        },
      },
    },
  },
  {
    testDescription:
      'should successfully parse if there are additional spaces and brackets',
    query: ' name:john  OR  ( name:bob    status:active_user ) ',
    expectedResult: {
      type: ExpressionNodeType.Or,
      range: [1, 50],
      leftChild: {
        type: ExpressionNodeType.KeyValue,
        range: [1, 10],
        key: {
          range: [1, 5],
          content: 'name',
          hasQuotes: false,
        },
        value: {
          range: [6, 10],
          content: 'john',
          hasQuotes: false,
        },
      },
      rightChild: {
        type: ExpressionNodeType.And,
        range: [18, 48],
        leftChild: {
          type: ExpressionNodeType.KeyValue,
          range: [18, 26],
          key: {
            range: [18, 22],
            content: 'name',
            hasQuotes: false,
          },
          value: {
            range: [23, 26],
            content: 'bob',
            hasQuotes: false,
          },
        },
        rightChild: {
          type: ExpressionNodeType.KeyValue,
          range: [30, 48],
          key: {
            range: [30, 36],
            content: 'status',
            hasQuotes: false,
          },
          value: {
            range: [37, 48],
            content: 'active_user',
            hasQuotes: false,
          },
        },
      },
    },
  },
];

interface TestExpectedToFail {
  testDescription: string;
  query: string;
}

const TESTS_EXPECTED_TO_FAIL: TestExpectedToFail[] = [
  {
    testDescription: 'should fail when trying to parse an empty string',
    query: '',
  },
  {
    testDescription: 'should fail when using empty brackets',
    query: 'name:john AND ()',
  },
  {
    testDescription: 'should fail when omitting the left child of "AND"',
    query: 'AND name:john',
  },
  {
    testDescription: 'should fail when omitting the right child of "AND"',
    query: 'name:john AND',
  },
];

for (const singleTest of TESTS_EXPECTED_TO_SUCCEED) {
  it(`${singleTest.testDescription} (query: '${singleTest.query}')`, () => {
    const parseResult = parse(singleTest.query);
    expect(parseResult.success).toEqual(true);
    if (!parseResult.success) {
      return;
    }

    expect(parseResult.data).toEqual(singleTest.expectedResult);
  });
}

for (const singleTest of TESTS_EXPECTED_TO_FAIL) {
  it(`${singleTest.testDescription} (query: '${singleTest.query}')`, () => {
    const parseResult = parse(singleTest.query);
    expect(parseResult.success).toEqual(false);
  });
}
