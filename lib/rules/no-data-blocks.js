/**
 * @fileoverview Do not embed large data in code
 * @author S Anand <s.anand@gramener.com>
 */
"use strict";

const walk = require("acorn-walk");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Report error only if data block has more than DEFAULT_MIN literals
const DEFAULT_MIN = 100;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Do not embed large data in code",
      recommended: false,
      url: "https://github.com/gramener/eslint-plugin-no-data-blocks/blob/HEAD/docs/rules/no-data-blocks.md",
    },
    fixable: null,
    schema: [{ type: "integer" }],
    messages: {
      "no-data-blocks": "Data block with {{count}} items",
    },
  },

  create(context) {
    let min = context.options[0];
    min = min === undefined || min === null ? DEFAULT_MIN : min;

    return {
      Program(tree) {
        for (const [count, node] of dataBlocks(tree, min)) {
          context.report({
            node,
            messageId: "no-data-blocks",
            data: { count },
          });
        }
      },
    };
  },
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** Returns data-only nodes, i.e. that contain only literals, arrays, and objects.
 *
 * @param {object} tree - ESTree node to search in
 * @param {number} min - Ignore data blocks with less than min literals
 * @returns {Array[]} - Array of [count, node] containing data-only blocks
 */
function dataBlocks(tree, min = 0) {
  const state = [];
  // Count # of literals in each node, recursively. Store it in _count.
  // When adding the count to a parent, delete _count from the child. (No double-counting.)
  walk.recursive(tree, state, {
    // Count literals ("x") and identifiers (x) as 1 unit
    Literal(node) {
      node._count = 1;
    },
    Identifier(node) {
      node._count = 1;
    },
    // Array size = sum of element sizes
    ArrayExpression(node, state, c) {
      node._count = 0;
      node.elements.forEach((el) => {
        c(el, state);
        node._count += el._count;
      });
      if (node._count > 0) {
        state.push(node);
        node.elements.forEach((el) => delete el._count);
      }
    },
    // Object size = sum of properties
    ObjectExpression(node, state, c) {
      node._count = 0;
      node.properties.forEach((el) => {
        c(el, state);
        node._count += el._count;
      });
      if (node._count > 0) {
        state.push(node);
        node.properties.forEach((el) => delete el._count);
      }
    },
    // Property size = key + value size
    Property(node, state, c) {
      c(node.key, state);
      c(node.value, state);
      node._count = node.key._count + node.value._count;
      delete node.key._count;
      delete node.value._count;
    },
  });
  // state has all data blocks (including sub-data blocks, i.e. children of other data blocks)
  return (
    state
      // Pick only root data blocks. sub-data blocks won't have _count
      .filter((el) => "_count" in el)
      // Ensure AST is not modified. Remove _count. Return [count, node]
      .map((el) => {
        const count = el._count;
        delete el._count;
        return [count, el];
      })
      // Filter out small data blocks
      .filter((el) => el[0] >= min)
  );
}
