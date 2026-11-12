// ============================================================================
//  Header.jsx  —  the top navigation bar shown on every page
// ============================================================================
//
//  PURPOSE: your name/logo on the left, the navigation links and the dark-mode
//  toggle on the right.
//
//  HOW TO ADD A NAV LINK: copy one line in the `links` array below and change
//  its href + label. Each href must match a <Route> in src/App.jsx.
//
//  <Link> is React Router's version of <a>: it changes the page without
//  reloading the whole site.
// ============================================================================

import { Link, useLocation } from 'react-router';
import HeaderMorph from './HeaderMorph';
import ThemeToggle from './ThemeToggle';

// EDIT HERE: the navigation menu. Add/remove items by editing this list.
const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/problems', label: 'Problems' },
  { href: '/research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
];

function Header() {
  // Work out which link is the current page so we can highlight it.
  const current = useLocation().pathname;
  const isActive = (href) => (href === '/' ? current === '/' : current.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10" aria-label="Main navigation">
        {/* Name / wordmark links back home. EDIT HERE to change the wordmark. */}
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Pema Tsering
          {/* The small morphing wireframe (box -> DNA helix -> graph) that
              rotates continuously and follows the nearby mouse. See src/components/HeaderMorph.jsx. */}
          <HeaderMorph />
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? 'text-accent-500'
                      : 'text-slate-600 hover:text-accent-500 dark:text-slate-300 dark:hover:text-accent-400'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      {/* On small phones the links collapse to a simple scrollable row. */}
      <ul className="flex items-center gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive(link.href)
                  ? 'text-accent-500'
                  : 'text-slate-600 hover:text-accent-500 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}

export default Header;
