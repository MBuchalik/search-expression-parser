import { ErrorResultWithData, SuccessResultWithData } from 'micro-result';

import {
  AndNode,
  ExpressionNode,
  ExpressionNodeType,
  KeyValueNode,
  NotNode,
  OrNode,
  ValueNode,
} from './models';

export interface FilterResult {
  isMatching: boolean;
}
export type DataMatcher<TItem, TError> = (
  expressionNode: KeyValueNode | ValueNode,
  item: TItem,
) => SuccessResultWithData<FilterResult> | ErrorResultWithData<TError>;

/**
 * A helper function that returns all entries from {@link items} that match the provided {@link parsedSearchExpression}.
 *
 * Basically, this function removes the need to explicitly provide handling for nodes like "AND" and similar.
 * The only part that needs to be implemented by the caller of this function is the handling of Key-Value and Value-Only nodes through {@link dataMatcher}.
 *
 * ### The "dataMatcher"
 *
 * Parameter {@link dataMatcher} contains a function that is called whenever a Key-Value node or a Value-Only node is reached in the search expression tree.
 *
 * You need to implement this function on your own.
 *
 * An example implementation:
 *
 * ``` ts
 * const dataMatcher = (expressionNode, item) => {
 *  if (expressionNode.type === ExpressionNodeType.KeyValue) {
 *    // This is really just an example. You should add your own logic here!
 *    if (item[expressionNode.key.value] === expressionNode.value.value) {
 *      return {
 *        success: true,
 *        data: {
 *          isMatching: true
 *        }
 *      }
 *    }
 *    return {
 *      success: true,
 *      data: {
 *        isMatching: false
 *      }
 *    }
 *  }
 *
 *  return {
 *    success: false,
 *    error: 'We do not allow Value-Only expressions like "foo bar baz". You may only use Key-Value pairs like "foo:bar".'
 *  }
 * }
 * ```
 *
 *
 * ### Return type
 *
 * If no error occurred, {@link filter} returns all entries from {@link items} that match the provided search expression. In this case, the result looks roughly like this:
 *
 * ``` ts
 * {
 *  success: true,
 *  data: // The filtered items as an array.
 * }
 * ```
 *
 * However, we also provide handling for errors.
 * When an error occurred, the evaluation of the search will be terminated and the error will be returned.
 * To make the implementation type-safe, we do not throw Errors.
 * Instead, the returned data simply looks like this:
 * ``` ts
 * {
 *  success: false,
 *  error: // The error.
 * }
 * ```
 *
 * The error case is particularly useful when building an application where the keys or values used in a search expression are somewhat limited.
 * For instance, imagine you only want to allow lowercase keys. But the user has entered an uppercase key.
 * In this case, you don't want the search to be evaluated completely.
 * Thus, simply return something like this in your custom {@link dataMatcher}:
 *
 * ``` ts
 * {
 *   success: false,
 *   error: 'We do not allow uppercase letters as keys.'
 * }
 * ```
 */
export function filter<TItem, TError>(
  items: TItem[],
  parsedSearchExpression: ExpressionNode,
  dataMatcher: DataMatcher<TItem, TError>,
): SuccessResultWithData<TItem[]> | ErrorResultWithData<TError> {
  const result: TItem[] = [];

  for (const singleItem of items) {
    const dispatcherContext: DispatcherContext<TItem, TError> = {
      item: singleItem,
      dataMatcher: dataMatcher,
    };

    const filterResult = dispatch<TItem, TError>(
      parsedSearchExpression,
      dispatcherContext,
    );
    if (!filterResult.success) {
      return filterResult;
    }
    if (!filterResult.data.isMatching) {
      continue;
    }
    result.push(singleItem);
  }

  return {
    success: true,
    data: result,
  };
}

interface DispatcherContext<TItem, TError> {
  item: TItem;
  dataMatcher: DataMatcher<TItem, TError>;
}
function dispatch<TItem, TError>(
  expressionNode: ExpressionNode,
  context: DispatcherContext<TItem, TError>,
): SuccessResultWithData<FilterResult> | ErrorResultWithData<TError> {
  switch (expressionNode.type) {
    case ExpressionNodeType.And:
      return handleAndNode(expressionNode, context);
    case ExpressionNodeType.Or:
      return handleOrNode(expressionNode, context);
    case ExpressionNodeType.Not:
      return handleNotNode(expressionNode, context);
    case ExpressionNodeType.KeyValue:
      return context.dataMatcher(expressionNode, context.item);
    case ExpressionNodeType.Value:
      return context.dataMatcher(expressionNode, context.item);
  }
}

function handleAndNode<TItem, TError>(
  expressionNode: AndNode,
  context: DispatcherContext<TItem, TError>,
): SuccessResultWithData<FilterResult> | ErrorResultWithData<TError> {
  const leftChildResult = dispatch<TItem, TError>(
    expressionNode.leftChild,
    context,
  );
  if (!leftChildResult.success) {
    return leftChildResult;
  }
  // Short-circuit: The left child does not match, so we know that the whole expression does not match.
  if (!leftChildResult.data.isMatching) {
    return leftChildResult;
  }

  const rightChildResult = dispatch<TItem, TError>(
    expressionNode.rightChild,
    context,
  );
  return rightChildResult;
}
function handleOrNode<TItem, TError>(
  expressionNode: OrNode,
  context: DispatcherContext<TItem, TError>,
): SuccessResultWithData<FilterResult> | ErrorResultWithData<TError> {
  const leftChildResult = dispatch<TItem, TError>(
    expressionNode.leftChild,
    context,
  );
  if (!leftChildResult.success) {
    return leftChildResult;
  }
  // Short-circuit: The left child matches, so we know that the whole expression matches.
  if (leftChildResult.data.isMatching) {
    return leftChildResult;
  }

  const rightChildResult = dispatch<TItem, TError>(
    expressionNode.rightChild,
    context,
  );
  return rightChildResult;
}
function handleNotNode<TItem, TError>(
  expressionNode: NotNode,
  context: DispatcherContext<TItem, TError>,
): SuccessResultWithData<FilterResult> | ErrorResultWithData<TError> {
  const childResult = dispatch<TItem, TError>(expressionNode.child, context);
  if (!childResult.success) {
    return childResult;
  }

  return {
    success: true,
    data: {
      isMatching: !childResult.data.isMatching,
    },
  };
}
