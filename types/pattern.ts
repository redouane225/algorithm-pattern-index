export type Locale = "en" | "fr";

export type Difficulty = "beginner" | "intermediate" | "advanced";

// Language-neutral keys. Display labels live in the UI dictionaries.
export type CategoryId =
  | "basic"
  | "lookup"
  | "sequences"
  | "searching"
  | "recursion"
  | "optimization"
  | "combinatorial";

export interface PatternExample {
  problem: string;
  why: string;
}

export interface Pattern {
  id: string; // kebab-case, unique, equals the URL slug
  name: string; // translated
  category: CategoryId; // language-neutral key
  difficulty: Difficulty; // language-neutral key
  tags: string[]; // translated, searchable keywords
  recognize: string[]; // translated clues from problem statements
  idea: string; // translated, concise conceptual explanation
  pseudocode: string[]; // ordered steps, translated
  time: string; // e.g. "O(n)", identical in both files
  space: string; // e.g. "O(1)", identical in both files
  example: PatternExample; // translated
  related: string[]; // IDs of other patterns (must exist)
}
