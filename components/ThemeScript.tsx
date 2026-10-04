/**
 * Runs before first paint to apply a stored theme choice and avoid a flash of the
 * wrong theme. With no stored choice, CSS `color-scheme: light dark` follows the OS.
 * Relies on 'unsafe-inline' in the CSP (see DECISIONS.md). Storage access is wrapped
 * in try/catch because it throws when storage is blocked.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.classList.add(t)}}catch(e){}})();`;

export function ThemeScript(): React.JSX.Element {
  // React renders string children of <script> verbatim (no innerHTML API needed).
  return <script>{THEME_INIT_SCRIPT}</script>;
}
