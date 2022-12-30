export type ExpressionNode =
  | AndNode
  | OrNode
  | NotNode
  | KeyValueNode
  | ValueNode
  | LiteralNode;

export enum ExpressionNodeType {
  KeyValue = 'KEY-VALUE',
  Value = 'VALUE',

  And = 'AND',
  Or = 'OR',
  Not = 'NOT',

  Literal = 'LITERAL',
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

  key: LiteralNode;
  value: LiteralNode;
}
export interface ValueNode extends NodeBase {
  type: ExpressionNodeType.Value;

  value: LiteralNode;
}
export type LiteralNode = RegularLiteralNode | QuotedLiteralNode;
export interface RegularLiteralNode extends NodeBase {
  type: ExpressionNodeType.Literal;

  value: string;

  hasQuotes: false;
}
export interface QuotedLiteralNode
  extends Omit<RegularLiteralNode, 'hasQuotes'> {
  hasQuotes: true;
  rangeWithoutQuotes: Range;
}
