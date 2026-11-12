// ============================================================================
//  Layout.jsx  —  the shared "frame" wrapped around every page
// ============================================================================
//
//  PURPOSE: the page background, the header navigation and the footer all
//  live here in ONE place. src/App.jsx wraps its routes in <Layout>, and the
//  current page arrives through the special `children` prop:
//
//      <Layout>
//        ...the page for the current URL...
//      </Layout>
// ============================================================================

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import Background from './Background';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);

  // A single-page app never reloads, so the browser would keep the old scroll
  // position when you click a link. Jump back to the top on every page change.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (previousPath.current !== pathname) {
      const heading = mainRef.current?.querySelector('h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      } else {
        mainRef.current?.focus({ preventScroll: true });
      }
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      {/* The page background: a drifting gradient on Home, a wireframe
          animation on Projects / Problems / Research, nothing elsewhere. It
          sits behind everything (z-index:-1) and re-colours with the theme. */}
      <Background />

      {/* Skip link for keyboard / screen-reader users (accessibility). */}
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView({ block: 'start' });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      {/* The actual page content gets dropped in here via `children`.
          Full-width content with a little breathing room at the edges.
          key={pathname} makes React create a fresh <main> for each page, which
          replays the gentle fade-in animation on every navigation. */}
      <main id="main" ref={mainRef} tabIndex={-1} key={pathname} className="w-full min-w-0 flex-1 px-4 py-10 sm:px-6 lg:px-10 animate-fade-in">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;
