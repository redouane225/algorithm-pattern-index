import { readFileSync } from "fs";
import { join } from "path";
import { validatePatternArray } from "../lib/validate";

function run() {
  try {
    const enPath = join(process.cwd(), "data", "patterns.en.json");
    const frPath = join(process.cwd(), "data", "patterns.fr.json");

    const enData = JSON.parse(readFileSync(enPath, "utf-8"));
    const frData = JSON.parse(readFileSync(frPath, "utf-8"));

    const enValid = validatePatternArray(enData);
    const frValid = validatePatternArray(frData);
    
    // Check parity
    if (enValid.length !== frValid.length) {
      throw new Error(`Parity mismatch: EN has ${enValid.length}, FR has ${frValid.length}`);
    }

    const enIds = enValid.map(p => p.id).sort();
    const frIds = frValid.map(p => p.id).sort();
    for (let i = 0; i < enIds.length; i++) {
      if (enIds[i] !== frIds[i]) {
         throw new Error(`ID mismatch: EN has ${enIds[i]}, FR has ${frIds[i]}`);
      }
    }

    console.log("Data validation passed.");
    process.exit(0);
  } catch (error) {
    console.error("Data validation failed:", error);
    process.exit(1);
  }
}

run();
