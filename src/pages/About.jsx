// ============================================================================
//  src/pages/About.jsx  —  the ABOUT page  (the "/about" route)
// ============================================================================
//
//  WHAT'S HERE: a narrative bio tying together your coding journey and your
//  research background and a grouped skills list.
//  Everything marked EDIT HERE is yours to rewrite.
// ============================================================================

import { usePageMeta } from '../hooks/usePageMeta';

// EDIT HERE: your skills, grouped by category. Add/remove freely.
// The first three groups mirror my CV; the last one covers skills the
// projects on this site use. (Certifications live in the CV itself.)
const skillGroups = [
  { heading: 'Programming', items: ['Python', 'R', 'SQL', 'Bash', 'JavaScript'] },
  {
    heading: 'Frontend Development',
    items: ['HTML', 'CSS', 'Vue.js', 'React', 'Tailwind CSS'],
  },
  {
    heading: 'Tools & Technologies',
    items: ['Git & GitHub', 'PostgreSQL', 'Figma', 'Microsoft Office (Word, Excel, PowerPoint)'],
  },
  {
    heading: 'Software Engineering',
    items: [
      'Data Structures & Algorithms',
      'Unit testing (Python unittest)',
      'Relational database Design',
      'Rest API Integration',
    ],
  },
];

function About() {
  usePageMeta(
    'About — Pema Tsering',
    'The coding journey and research background of a London-based developer and molecular-biology researcher.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">About</h1>

      {/* ===================== BIO ===================== */}
      {/* EDIT HERE: rewrite this narrative in your own voice. */}
      <div className="prose-content mt-6 text-slate-700 dark:text-slate-300">
        <p>
          When I started studying biochemistry at King's College London, 
          I thought I’d go into bioinformatics. I liked the idea of using code to answer questions about biology, 
          and iGEM was where I first got to try that in a team. 
          I worked with teammates to agree on page designs in Figma and then 
          implement them on our project wiki. I also built a Python 
          simulation to estimate how many gas vesicles bacteria might 
          produce.
        </p>
        <p>
          Long story short, I couldn't secure a bioinformatics placment in my second year 
          but fortunately, I still managed to secure a different placement. 
          During my placement at STFC’s ISIS Neutron and Muon Source, I looked 
          for ways to bring programming into the training courses I was 
          developing with instrument scientists. I used Manim, a 
          Python animation library, to explain concepts such as isotopic 
          contrast and Fourier transforms. I also built a simplified neutron 
          reflectometry model based on Refl1D and checked its predictions 
          against established theory. The model let me explore how properties 
          such as layer thickness and surface roughness affect reflectivity.
        </p>
        <p>
          That placement was also where I learned R in more depth. To 
          prepare worked examples for how the basics of the Mantid software worked in 
          my neutron reflectometry courses, I took raw time-of-flight data from the 
          SURF reflectometer and used R to convert the measurements to wavelength and 
          momentum transfer. I then subtracted the background and normalised the data to 
          produce reflectivity curves that learners could check and understand.
        </p>
        <p>
          When I returned to university for my final year, I kept using R in my 
          bioinformatics modules, applying what I’d learned on placement to 
          biological data. I also made a habit of tackling freeCodeCamp’s 
          daily coding challenges. I had built some mini projects here and there but took 
          programming more seriously after third year exams ended. Since then, I’ve 
          practised solving unfamiliar problems on Codeforces and also built projects with databases, APIs and web 
          interfaces. The more I built, the more I wanted to make software development my career.
        </p>
      </div>

      {/* ===================== SKILLS ===================== */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">Skills</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.heading} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-link">
                {group.heading}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className={item === 'Rest API Integration' ? 'basis-full' : undefined}>
                    <span className="block w-fit rounded bg-slate-100 px-2.5 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default About;
