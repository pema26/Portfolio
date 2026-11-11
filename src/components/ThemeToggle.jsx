// ============================================================================
//  ThemeToggle.jsx  —  the dark / light mode switch button
// ============================================================================
//
//  PURPOSE: a single button that flips the site between dark and light mode
//  and remembers the choice in the browser (localStorage) for next time.
//
//  All of the logic lives in the useTheme custom hook (src/hooks/useTheme.js);
//  this component is just the button and its two icons.
// ============================================================================

import { useTheme } from '../hooks/useTheme';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      {isDark ? (
        // Sun icon: shown in dark mode (click to go light)
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M6.05 6.05 4.636 4.636m12.728 0L15.95 6.05M6.05 17.95l-1.414 1.414M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        </svg>
      ) : (
        // Moon icon: shown in light mode (click to go dark)
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
