// ============================================================================
//  src/hooks/useTheme.js  —  custom hook: dark / light mode
// ============================================================================
//
//  PURPOSE: holds "is the site in dark mode?" in React state and keeps the
//  rest of the world in step with it. It returns the current value and a
//  function to flip it:
//
//      const { isDark, toggleTheme } = useTheme();
//
//  WHICH THEME WINS: a choice the visitor made with the toggle button (saved
//  in localStorage) always wins; otherwise we follow the operating system /
//  browser "dark mode" setting.
//
//  (Tailwind shows the `dark:` styles whenever <html> has class="dark". The
//  tiny script in index.html adds that class before the first paint so there
//  is no flash of the wrong theme; this hook takes over from there.)
// ============================================================================

import { useState, useEffect } from 'react';

const osDarkQuery = '(prefers-color-scheme: dark)';

// Work out which theme should be showing right now.
function getPreferredDark() {
  const saved = localStorage.getItem('theme');
  // A saved manual choice wins; otherwise follow the OS setting.
  return saved ? saved === 'dark' : window.matchMedia(osDarkQuery).matches;
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getPreferredDark());

  // Side effect 1: whenever the state changes, add/remove the "dark" class on
  // the <html> tag so the Tailwind dark styles switch on or off.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Side effect 2 (runs once): listen for changes that happen OUTSIDE this
  // component, and tidy the listeners up again when the component goes away.
  useEffect(() => {
    const osPrefersDark = window.matchMedia(osDarkQuery);

    // If the OS switches theme (e.g. automatic dark mode at sunset) and the
    // visitor never picked one manually, follow along live.
    const handleOsChange = () => setIsDark(getPreferredDark());

    // Keep every open tab in sync: the "storage" event fires in OTHER tabs
    // whenever the toggle saves a new choice in this one.
    const handleStorage = (event) => {
      if (event.key === 'theme') setIsDark(getPreferredDark());
    };

    osPrefersDark.addEventListener('change', handleOsChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      osPrefersDark.removeEventListener('change', handleOsChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Called by the toggle button: flip the theme and remember the choice.
  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  };

  return { isDark, toggleTheme };
}
