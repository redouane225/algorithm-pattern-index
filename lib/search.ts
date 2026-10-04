import type { Pattern } from "@/types/pattern";

export function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove diacritics
}

export function searchPatterns(
  patterns: Pattern[],
  query: string,
  categoryId: string | null,
  difficulty: string | null,
  categoryLabels: Record<string, string>
): Pattern[] {
  const normQuery = normalize(query);

  return patterns.filter((pattern) => {
    // 1. Filter by category
    if (categoryId && categoryId !== "all" && pattern.category !== categoryId) {
      return false;
    }

    // 2. Filter by difficulty
    if (difficulty && difficulty !== "all" && pattern.difficulty !== difficulty) {
      return false;
    }

    // 3. Search query
    if (!normQuery) {
      return true;
    }

    // Match against: name, category label, tags, recognize, idea
    const searchableTexts = [
      pattern.name,
      categoryLabels[pattern.category],
      ...pattern.tags,
      ...pattern.recognize,
      pattern.idea,
    ].filter(Boolean) as string[];

    // True if any field includes the query (simpler, exact substring matching)
    // We join them with a separator so cross-field false matches don't happen easily
    const combinedText = searchableTexts.map(normalize).join(" | ");
    return combinedText.includes(normQuery);
  });
}
