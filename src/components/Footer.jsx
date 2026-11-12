// ============================================================================
//  Footer.jsx  —  the bottom bar shown on every page
// ============================================================================
//
//  PURPOSE: copyright line and a few quick social links.
//  EDIT HERE: change the links in the `socials` list below. An entry with no
//  `href` is shown as plain text (used for things that are not ready yet).
// ============================================================================

// EDIT HERE: your social / scholarly links.
const socials = [
  { href: 'https://github.com/pema26', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/pema-tsering-kcl/', label: 'LinkedIn' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="flex w-full flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-10 dark:text-slate-400">
        <p>&copy; {year} Pema Tsering. Built with React and Vite.</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {socials.map((social) => (
            <li key={social.label}>
              {social.href ? (
                <a
                  href={social.href}
                  className="transition hover:text-accent-500"
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {social.label}
                </a>
              ) : (
                <span>{social.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
