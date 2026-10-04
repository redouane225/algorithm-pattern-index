export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Narrows an untrusted string (e.g. a URL segment) to a supported locale. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Replaces the first path segment with `target`, keeping the rest of the path.
 * `/en/patterns/x` -> `/fr/patterns/x`. A path without a locale gets one prefixed.
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  const [first, ...rest] = segments;
  const remaining = first !== undefined && isLocale(first) ? rest : segments;
  return "/" + [target, ...remaining].join("/");
}
