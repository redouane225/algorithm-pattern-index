import { readFileSync } from "fs";
import { join } from "path";
import type { Pattern, Locale } from "../types/pattern";

export function getPatterns(lang: Locale): Pattern[] {
  const filePath = join(process.cwd(), "data", `patterns.${lang}.json`);
  const fileData = readFileSync(filePath, "utf-8");
  const patterns: Pattern[] = JSON.parse(fileData);
  // Sort by id ASC to ensure deterministic rendering
  return patterns.sort((a, b) => a.id.localeCompare(b.id));
}

export function getDictionary(lang: Locale) {
  const filePath = join(process.cwd(), "data", "ui", `${lang}.json`);
  const fileData = readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
}

export function getPattern(lang: Locale, id: string): Pattern | undefined {
  const patterns = getPatterns(lang);
  return patterns.find((p) => p.id === id);
}
