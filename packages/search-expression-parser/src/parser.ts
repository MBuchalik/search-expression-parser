/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { Result } from 'micro-result';
import ohm from 'ohm-js';

import { ExpressionNode, ExpressionNodeType } from './models';

/*
  Regarding operator precedence:
  We want "NOT" to bind tighter than "AND". And we want "AND" to bind tighter than "OR".
  To achieve this, we follow the idea of the Ohm example regarding math arithmetics, which basically says that the weaker binding operators should come first and "call" the stronger-binding ones.
  In the math example, the following is defined:
  Exp
    = AddExp

  AddExp
    = AddExp "+" MulExp  -- plus
    | AddExp "-" MulExp  -- minus
    | MulExp

  MulExp
    = MulExp "*" ExpExp  -- times
    | MulExp "/" ExpExp  -- divide
    | ExpExp

  Here, we use the same structure, but of course with "OR", "AND", and "NOT".
*/

const grammarSource = String.raw`
  MyGrammar {
    exp 
      = space* orExpression space*

    orExpression 
      = orExpression space+ caseInsensitive<"OR"> space+ andExpression  -- recurse
      | andExpression                                                   -- passthrough

    andExpression 
      = andExpression space+ caseInsensitive<"AND"> space+ notExpression   -- recurseWithExplicitAnd      
      | andExpression space+ notExpression                                 -- recurseWithImplicitAnd
      | notExpression                                                      -- passthrough

    notExpression 
      = caseInsensitive<"NOT"> space+ singleExpression -- default
      | singleExpression                                      -- passthrough

    singleExpression 
      = "(" space* exp space* ")"                            -- brackets
      | #(keyValueExpressionKey ":" keyValueExpressionValue) -- keyvalue
      | onlyValueExpression                                  -- onlyvalue

    keyValueExpressionKey
      = nonEmptyLiteralWithoutQuotes | literalWithQuotes

    keyValueExpressionValue 
      // We first need to use "literalWithQuotes" and use "possiblyEmptyLiteralWithoutQuotes". Otherwise, the parser will run into "possiblyEmptyLiteralWithoutQuotes" and error out.
      = literalWithQuotes | possiblyEmptyLiteralWithoutQuotes

    onlyValueExpression = nonEmptyLiteralWithoutQuotesThatIsNotReserved | literalWithQuotes

    /*
      A value that is not enclosed in double quotes.
      We allow any string that does not contain double quotes, round brackets, colons, or spaces.
      The value must contain at least one character.
    */
    nonEmptyLiteralWithoutQuotes 
      = (~"\"" ~"(" ~")" ~":" ~space any)+

    // Similar to nonEmptyLiteralWithoutQuotes, but we additionally do not allow "AND", "OR" or "NOT".
    nonEmptyLiteralWithoutQuotesThatIsNotReserved
      = ~(reservedKeywords ~nonEmptyLiteralWithoutQuotes) nonEmptyLiteralWithoutQuotes

    // Similar to nonEmptyLiteralWithoutQuotes, but we allow an empty string here as well.
    possiblyEmptyLiteralWithoutQuotes
      = (~"\"" ~"(" ~")" ~":" ~space any)*    

    /*
      A value that is enclosed in double quotes. 
      We allow any string within this (except for double quotes of course, since they terminate this string).
    */
    literalWithQuotes 
      = "\""(~"\"" any)*"\""

    reservedKeywords = caseInsensitive<"AND"> | caseInsensitive<"OR"> | caseInsensitive<"NOT">
  }
  `;

const instantiatedGrammar = ohm.grammar(grammarSource);

const semantics = instantiatedGrammar
  .createSemantics()
  .addOperation<ExpressionNode | string>('eval', {
    exp(_a, b, _c): ExpressionNode {
      return b.eval();
    },
    orExpression_recurse(a, _b, _c, _d, e): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Or,

        leftChild: a.eval(),
        rightChild: e.eval(),
      };
    },
    orExpression_passthrough(a): ExpressionNode {
      return a.eval();
    },
    andExpression_recurseWithExplicitAnd(a, _b, _c, _d, e): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.And,

        leftChild: a.eval(),
        rightChild: e.eval(),
      };
    },
    andExpression_recurseWithImplicitAnd(a, _b, c): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.And,

        leftChild: a.eval(),
        rightChild: c.eval(),
      };
    },
    andExpression_passthrough(a): ExpressionNode {
      return a.eval();
    },
    notExpression_default(_a, _b, c): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Not,

        child: c.eval(),
      };
    },
    notExpression_passthrough(a): ExpressionNode {
      return a.eval();
    },
    singleExpression_brackets(_a, _b, c, _d, _e): ExpressionNode {
      return c.eval();
    },
    singleExpression_keyvalue(a, _b, c): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.KeyValue,

        key: a.eval(),
        value: c.eval(),
      };
    },
    singleExpression_onlyvalue(a): ExpressionNode {
      return a.eval();
    },
    keyValueExpressionKey(a): ExpressionNode {
      return a.eval();
    },
    keyValueExpressionValue(a): ExpressionNode {
      return a.eval();
    },
    onlyValueExpression(a): ExpressionNode {
      return a.eval();
    },

    nonEmptyLiteralWithoutQuotes(a): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Literal,

        value: a.sourceString,

        hasQuotes: false,
      };
    },
    nonEmptyLiteralWithoutQuotesThatIsNotReserved(a): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Literal,

        value: a.sourceString,

        hasQuotes: false,
      };
    },
    possiblyEmptyLiteralWithoutQuotes(a): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Literal,

        value: a.sourceString,

        hasQuotes: false,
      };
    },
    literalWithQuotes(_a, b, _c): ExpressionNode {
      return {
        range: [this.source.startIdx, this.source.endIdx],

        type: ExpressionNodeType.Literal,

        value: b.sourceString,

        hasQuotes: true,
        rangeWithoutQuotes: [b.source.startIdx, b.source.endIdx],
      };
    },
  });

export function parse(query: string): Result<ExpressionNode> {
  const matchResult = instantiatedGrammar.match(query);
  if (!matchResult.succeeded()) {
    return { success: false };
  }

  const expressionTree = semantics(matchResult).eval();

  return {
    success: true,
    data: expressionTree,
  };
}
