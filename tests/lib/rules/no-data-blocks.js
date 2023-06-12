/**
 * @fileoverview Do not embed large data in code
 * @author S Anand <s.anand@gramener.com>;
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-data-blocks"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-data-blocks", rule, {
  valid: [
    { code: JSON.stringify(array(99)) },
    { code: "var x = " + JSON.stringify(array(98)) },
    { code: JSON.stringify(array(100)), options: [101] },
  ],

  invalid: [
    {
      code: JSON.stringify(array(100)),
      errors: [
        {
          message: "Data block with 100 items",
          type: "ArrayExpression",
        },
      ],
    },
    {
      code: "var x = " + JSON.stringify({ key: array(99) }),
      errors: [
        {
          message: "Data block with 100 items",
          type: "ObjectExpression",
        },
      ],
    },
    {
      code: "var x = " + JSON.stringify({ a: { b: ["c", array(10)], d: array(5) } }),
      options: [19],
      errors: [
        {
          message: "Data block with 19 items",
          type: "ObjectExpression",
        },
      ],
    },
  ],
});

function array(length) {
  return Array.from({ length }, (_, i) => i);
}
