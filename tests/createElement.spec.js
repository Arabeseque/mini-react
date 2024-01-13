import { it, expect, describe } from "vitest";
import React from "../core/React.js";
// import { describe } from "node:test";

describe("createElement", () => {
    it("should return vdom", () => {
        const el = React.createElement('div', null, 'Hello World');

        expect(el).toMatchInlineSnapshot(`
          {
            "props": {
              "children": [
                "Hello World",
              ],
            },
            "type": "div",
          }
        `)
    })
})
