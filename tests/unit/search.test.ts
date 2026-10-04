import { expect, test } from "vitest";
import { normalize, searchPatterns } from "../../lib/search";
import { Pattern } from "../../types/pattern";

const testPatterns: Pattern[] = [
  {
    id: "sliding-window",
    name: "Sliding Window",
    category: "sequences",
    difficulty: "intermediate",
    tags: ["array", "subarray", "contiguous"],
    recognize: ["contiguous elements"],
    idea: "maintain a window",
    pseudocode: [],
    time: "O(n)",
    space: "O(1)",
    example: { problem: "p", why: "w" },
    related: [],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    difficulty: "beginner",
    tags: ["sorted"],
    recognize: ["find in sorted array"],
    idea: "divide and conquer",
    pseudocode: [],
    time: "O(log n)",
    space: "O(1)",
    example: { problem: "p", why: "w" },
    related: [],
  }
];

const mockDict = {
  sequences: "Séquences & Tableaux",
  searching: "Recherche & Parcours"
};

test("normalize removes diacritics and lowers case", () => {
  expect(normalize("Récursivité")).toBe("recursivite");
  expect(normalize("   HELLO  ")).toBe("hello");
});

test("searchPatterns filters by category", () => {
  const result = searchPatterns(testPatterns, "", "sequences", "all", mockDict);
  expect(result).toHaveLength(1);
  expect(result[0]?.id).toBe("sliding-window");
});

test("searchPatterns filters by difficulty", () => {
  const result = searchPatterns(testPatterns, "", "all", "beginner", mockDict);
  expect(result).toHaveLength(1);
  expect(result[0]?.id).toBe("binary-search");
});

test("searchPatterns filters by text match", () => {
  // matches 'window' in name or idea
  const result = searchPatterns(testPatterns, "window", "all", "all", mockDict);
  expect(result).toHaveLength(1);
  expect(result[0]?.id).toBe("sliding-window");
});

test("searchPatterns matches translated category name", () => {
  // 'séquences' matches 'Sequences & Tableaux'
  const result = searchPatterns(testPatterns, "séq", "all", "all", mockDict);
  expect(result).toHaveLength(1);
  expect(result[0]?.id).toBe("sliding-window");
});
