import { expect, test } from "vitest";
import { validatePatternArray } from "../../lib/validate";

test("validates valid pattern", () => {
  const data = [{
    id: "test",
    name: "Test",
    category: "basic",
    difficulty: "beginner",
    tags: ["tag"],
    recognize: ["clue"],
    idea: "idea",
    pseudocode: ["step 1"],
    time: "O(1)",
    space: "O(1)",
    example: { problem: "p", why: "w" },
    related: []
  }];
  expect(() => validatePatternArray(data)).not.toThrow();
});

test("throws on invalid category", () => {
  const data = [{
    id: "test",
    name: "Test",
    category: "not-a-category", // invalid
    difficulty: "beginner",
    tags: ["tag"],
    recognize: ["clue"],
    idea: "idea",
    pseudocode: ["step 1"],
    time: "O(1)",
    space: "O(1)",
    example: { problem: "p", why: "w" },
    related: []
  }];
  expect(() => validatePatternArray(data)).toThrow();
});
