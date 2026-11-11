// ============================================================================
//  src/pages/Contact.jsx  —  the CONTACT page  ("/contact" route)
// ============================================================================
//
//  WHAT'S HERE: your email and the important profile links. Replace every
//  [[...]] placeholder with your real details.
// ============================================================================

import { usePageMeta } from '../hooks/usePageMeta';

// EDIT HERE: your contact links. The href values are placeholders.
const links = [
  { label: 'Email', value: '[[YOUR_EMAIL]]', href: 'mailto:[[YOUR_EMAIL]]' },
  { label: 'GitHub', value: '[[GITHUB_URL]]', href: '[[GITHUB_URL]]' },
  { label: 'LinkedIn', value: '[[LINKEDIN_URL]]', href: '[[LINKEDIN_URL]]' },
  { label: 'ORCID', value: '[[ORCID_URL]]', href: '[[ORCID_URL]]' },
  { label: 'Google Scholar', value: '[[SCHOLAR_URL]]', href: '[[SCHOLAR_URL]]' },
];

function Contact() {
  usePageMeta(
    'Contact — [[YOUR_NAME]]',
    'Get in touch — email, GitHub, LinkedIn, ORCID, and Google Scholar.',
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
            <a
              href={link.href}
              className="text-accent-500 transition hover:underline"
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {link.value}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Contact;
