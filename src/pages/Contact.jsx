// ============================================================================
//  src/pages/Contact.jsx  —  the CONTACT page  ("/contact" route)
// ============================================================================
//
//  WHAT'S HERE: your email and the important profile links.
//  EDIT HERE: replace [[YOUR_EMAIL]] (it appears twice) in the `links` list
//  below with your real address. An entry with no `href` is shown as plain
//  text instead of a link.
// ============================================================================

import { usePageMeta } from '../hooks/usePageMeta';

// EDIT HERE: your contact links.
const links = [
  { label: 'Email', value: '[[YOUR_EMAIL]]', href: 'mailto:[[YOUR_EMAIL]]' },
  { label: 'GitHub', value: 'github.com/pema26', href: 'https://github.com/pema26' },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/pema-tsering-kcl',
    href: 'https://www.linkedin.com/in/pema-tsering-kcl/',
  },
];

function Contact() {
  usePageMeta(
    'Contact — Pema Tsering',
    'Get in touch — email, GitHub and LinkedIn.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Contact</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        The best way to reach me is by email. You can also find me on the platforms
        below.
      </p>

      <ul className="mt-8 max-w-3xl divide-y divide-slate-200 dark:divide-slate-800">
        {links.map((link) => (
          <li key={link.label} className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {link.label}
            </span>
            {link.href ? (
              <a
                href={link.href}
                className="text-accent-500 transition hover:underline"
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                {link.value}
              </a>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">{link.value}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Contact;
