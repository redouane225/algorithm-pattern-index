# How to import the 25 patterns

1. **Back up** your current `data/patterns.en.json` and `data/patterns.fr.json` (copy them, or make sure they are committed in Git).
2. Replace them with the two files from this folder. They already include the three earlier seed patterns (sliding-window, two-pointers, binary-search), so replacing is safe unless you edited those three by hand. If you did, merge your edits back in.
3. Check that your category keys are the expected 7 (see `CATEGORY_CHECK_PROMPT.md`). If `taxonomy.ts` uses different keys, tell me and I will regenerate the files with your keys.
4. Run `npm run validate:data`, then `npm run dev` and look at `/en` and `/fr`.
5. Paste `CATEGORY_CHECK_PROMPT.md` into the agent to audit the categories.

## Review before you trust the content
These entries were drafted for you. Per your own rule (write content only after you understand it), study each one, solve the example by hand, and fix anything that does not match your understanding. Pay special attention to:
- **Complexity strings:** `sliding-window` space `O(k)`, `prefix-sum` time `O(n + q)`, `quick-sort` is the average case, `backtracking` is `O(n * 2^n)`.
- **French wording:** names and terms (for example "Tri fusion", "Diviser pour régner", "Retour sur trace").
