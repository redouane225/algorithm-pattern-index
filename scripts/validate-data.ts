import { readFileSync } from "fs";
import { join } from "path";
import { validatePatternArray } from "../lib/validate";
import type { Pattern } from "../types/pattern";

function run() {
  try {
    const enPath = join(process.cwd(), "data", "patterns.en.json");
    const frPath = join(process.cwd(), "data", "patterns.fr.json");

    const enData = JSON.parse(readFileSync(enPath, "utf-8"));
    const frData = JSON.parse(readFileSync(frPath, "utf-8"));

    const enValid = validatePatternArray(enData, "patterns.en.json");
    const frValid = validatePatternArray(frData, "patterns.fr.json");
    
    // Check parity
    if (enValid.length !== frValid.length) {
      throw new Error(`Parity mismatch: EN has ${enValid.length}, FR has ${frValid.length}`);
    }

    const sortFn = (a: Pattern, b: Pattern) => a.id.localeCompare(b.id);
    const enSorted = [...enValid].sort(sortFn);
    const frSorted = [...frValid].sort(sortFn);

    for (let i = 0; i < enSorted.length; i++) {
      const enP = enSorted[i];
      const frP = frSorted[i];
      if (!enP || !frP) throw new Error("Missing item during iteration");

      if (enP.id !== frP.id) {
         throw new Error(`ID mismatch: EN has ${enP.id}, FR has ${frP.id}`);
      }

      const keysToMatch = ["category", "difficulty", "time", "space"] as const;
      for (const key of keysToMatch) {
        if (enP[key] !== frP[key]) {
          throw new Error(`Parity mismatch [${enP.id}]: field '${key}' must be identical. EN: ${enP[key]}, FR: ${frP[key]}`);
        }
      }

      if (JSON.stringify(enP.related) !== JSON.stringify(frP.related)) {
        throw new Error(`Parity mismatch [${enP.id}]: 'related' arrays must be identical.`);
      }
    }

    console.log("Data validation passed.");
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Data validation failed:", error.message);
    } else {
      console.error("Data validation failed:", error);
    }
    process.exit(1);
  }
}

run();
