import type { CategoryId, Difficulty } from "@/types/pattern";

export const CATEGORY_IDS: readonly CategoryId[] = [
  "basic",
  "lookup",
  "sequences",
  "searching",
  "recursion",
  "optimization",
  "combinatorial",
] as const;

export const DIFFICULTIES: readonly Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
