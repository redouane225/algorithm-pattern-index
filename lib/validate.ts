import { CATEGORY_IDS, DIFFICULTIES } from "./taxonomy";
import type { Pattern } from "../types/pattern";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNonEmptyString(v: unknown): v is string {
  return isString(v) && v.trim().length > 0;
}

export function validatePatternArray(data: unknown, filename: string): Pattern[] {
  if (!Array.isArray(data)) {
    throw new Error(`[${filename}] File must contain a JSON array.`);
  }

  const ids = new Set<string>();
  const patterns: Pattern[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i] as Record<string, unknown>;
    
    if (typeof item !== "object" || item === null) {
      throw new Error(`[${filename}] Item at index ${i} is not an object.`);
    }

    const { id, name, category, difficulty, tags, recognize, idea, pseudocode, time, space, example, related } = item;

    if (!isNonEmptyString(id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`[${filename}] Pattern at index ${i} has an invalid or missing id.`);
    }

    if (ids.has(id)) {
      throw new Error(`[${filename}] id "${id}" is not unique within the file.`);
    }
    ids.add(id);

    if (!isNonEmptyString(name)) throw new Error(`[${filename}] [${id}] Missing or empty name.`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isString(category) || !CATEGORY_IDS.includes(category as any)) {
      throw new Error(`[${filename}] [${id}] Invalid category: ${category}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isString(difficulty) || !DIFFICULTIES.includes(difficulty as any)) {
      throw new Error(`[${filename}] [${id}] Invalid difficulty: ${difficulty}`);
    }

    if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isNonEmptyString)) {
      throw new Error(`[${filename}] [${id}] Tags must be a non-empty array of non-empty strings.`);
    }

    if (!Array.isArray(recognize) || recognize.length === 0 || !recognize.every(isNonEmptyString)) {
      throw new Error(`[${filename}] [${id}] Recognize must be a non-empty array of non-empty strings.`);
    }

    if (!isNonEmptyString(idea)) throw new Error(`[${filename}] [${id}] Missing or empty idea.`);
    
    if (!Array.isArray(pseudocode) || pseudocode.length === 0 || !pseudocode.every(isNonEmptyString)) {
      throw new Error(`[${filename}] [${id}] Pseudocode must be a non-empty array of non-empty strings.`);
    }

    if (!isNonEmptyString(time) || !time.startsWith("O(")) {
      throw new Error(`[${filename}] [${id}] Time complexity must start with "O(" and not be empty.`);
    }

    if (!isNonEmptyString(space) || !space.startsWith("O(")) {
      throw new Error(`[${filename}] [${id}] Space complexity must start with "O(" and not be empty.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof example !== "object" || example === null || !isNonEmptyString((example as any).problem) || !isNonEmptyString((example as any).why)) {
      throw new Error(`[${filename}] [${id}] Example must be an object with non-empty 'problem' and 'why' strings.`);
    }

    if (!Array.isArray(related) || !related.every(isString)) {
      throw new Error(`[${filename}] [${id}] Related must be an array of strings.`);
    }

    if (related.includes(id)) {
      throw new Error(`[${filename}] [${id}] Pattern cannot be related to itself.`);
    }

    const expectedKeys = new Set(["id", "name", "category", "difficulty", "tags", "recognize", "idea", "pseudocode", "time", "space", "example", "related"]);
    const extraKeys = Object.keys(item).filter(k => !expectedKeys.has(k));
    if (extraKeys.length > 0) {
      throw new Error(`[${filename}] [${id}] Contains unknown fields: ${extraKeys.join(", ")}`);
    }

    patterns.push(item as unknown as Pattern);
  }

  // Second pass: Ensure related patterns exist
  for (const p of patterns) {
    for (const rel of p.related) {
      if (!ids.has(rel)) {
        throw new Error(`[${filename}] [${p.id}] Related ID "${rel}" does not exist in the file.`);
      }
    }
  }

  return patterns;
}
