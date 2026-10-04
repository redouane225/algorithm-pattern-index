import { describe, expect, it } from "vitest";
import { isLocale, swapLocaleInPath } from "@/lib/i18n";

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
  });

  it.each(["", "EN", "Fr", "de", "en/", " en", "english"])("rejects %j", (value) => {
    expect(isLocale(value)).toBe(false);
  });
});

describe("swapLocaleInPath", () => {
  it("keeps the rest of the path", () => {
    expect(swapLocaleInPath("/en/patterns/sliding-window", "fr")).toBe(
      "/fr/patterns/sliding-window",
    );
  });

  it("swaps a bare locale path", () => {
    expect(swapLocaleInPath("/fr", "en")).toBe("/en");
    expect(swapLocaleInPath("/fr/", "en")).toBe("/en");
  });

  it("is a no-op when the target is the current locale", () => {
    expect(swapLocaleInPath("/en/patterns/x", "en")).toBe("/en/patterns/x");
  });

  it("prefixes a locale when the path has none", () => {
    expect(swapLocaleInPath("/", "fr")).toBe("/fr");
    expect(swapLocaleInPath("/patterns/x", "fr")).toBe("/fr/patterns/x");
  });
});
