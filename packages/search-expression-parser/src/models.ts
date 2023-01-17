export type ExpressionNode =
  | AndNode
  | OrNode
  | NotNode
  | KeyValueNode
  | ValueNode;

export enum ExpressionNodeType {
  KeyValue = 'KEY-VALUE',
  Value = 'VALUE',

  And = 'AND',
  Or = 'OR',
  Not = 'NOT',
}

export type Range = [number, number];

export interface NodeBase {
  range: Range;
}

export interface AndNode extends NodeBase {
  type: ExpressionNodeType.And;

  leftChild: ExpressionNode;
  rightChild: ExpressionNode;
}
export interface OrNode extends NodeBase {
  type: ExpressionNodeType.Or;

  leftChild: ExpressionNode;
  rightChild: ExpressionNode;
}
export interface NotNode extends NodeBase {
  type: ExpressionNodeType.Not;

  child: ExpressionNode;
}
export interface KeyValueNode extends NodeBase {
  type: ExpressionNodeType.KeyValue;

  key: LiteralValue;
  value: LiteralValue;
}
export interface ValueNode extends NodeBase {
  type: ExpressionNodeType.Value;

  value: LiteralValue;
}

export type LiteralValue = RegularLiteralValue | QuotedLiteralValue;
export interface RegularLiteralValue extends NodeBase {
  /**
   * The actual value, i.e. the string found in the search expression.
   */
  content: string;

  hasQuotes: false;
}
export interface QuotedLiteralValue
  extends Omit<RegularLiteralValue, 'hasQuotes'> {
  hasQuotes: true;
  rangeWithoutQuotes: Range;
}
