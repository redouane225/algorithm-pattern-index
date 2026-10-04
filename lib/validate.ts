import { z } from "zod";
import { CATEGORY_IDS, DIFFICULTIES } from "./taxonomy";

// Helper to assert tuple for zod enums
const categoryTuple = CATEGORY_IDS as unknown as [string, ...string[]];
const difficultyTuple = DIFFICULTIES as unknown as [string, ...string[]];

export const PatternSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: z.enum(categoryTuple),
  difficulty: z.enum(difficultyTuple),
  tags: z.array(z.string().min(1)),
  recognize: z.array(z.string().min(1)).min(1),
  idea: z.string().min(1),
  pseudocode: z.array(z.string().min(1)).min(1),
  time: z.string().min(1),
  space: z.string().min(1),
  example: z.object({
    problem: z.string().min(1),
    why: z.string().min(1),
  }),
  related: z.array(z.string()),
});

export function validatePatternArray(data: unknown) {
  return z.array(PatternSchema).parse(data);
}
