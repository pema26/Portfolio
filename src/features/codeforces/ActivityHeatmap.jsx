// ============================================================================
//  ActivityHeatmap.jsx: a year of solved problems, one square per day
// ============================================================================
//
//  PURPOSE: the "calendar" view from a Codeforces profile. Each column is a
//  week (Sunday at the top), each square is a day, and a darker square means
//  more problems were solved that day.
//
//  PROPS:
//    weeks: from buildCalendar() in src/features/codeforces/codeforces.js: a list of 53
//            weeks, each a list of 7 { date, count, isFuture } days.
//
//  COLOUR: one hue (the site's indigo) in four steps. In light mode more
//  problems = darker; in dark mode more = lighter, so "more" always stands
//  out further from the background. The full class names are listed below so
//  Tailwind can see and keep them.
//
//  INTERACTION: pointing at (or tapping) a square stores that day in state,
//  and the line under the calendar reads it out.
//
//  On narrow screens the calendar scrolls sideways instead of shrinking; an
//  effect scrolls it to the right-hand end so the most recent weeks show.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { activityLevel } from './codeforces';

const CELL = 11; // size of one square, in pixels
const GAP = 3; // space between squares
const STEP = CELL + GAP;
const LEFT = 30; // room for the Mon / Wed / Fri labels
const TOP = 18; // room for the month names

// Level 0 (nothing solved) up to level 4 (five or more).
const LEVEL_CLASSES = [
  'fill-slate-200 dark:fill-slate-800',
  'fill-accent-400 dark:fill-accent-700',
  'fill-accent-500 dark:fill-accent-500',
  'fill-accent-700 dark:fill-accent-400',
  'fill-accent-900 dark:fill-accent-200',
];

const WEEKDAY_LABELS = [
  { row: 1, text: 'Mon' },
  { row: 3, text: 'Wed' },
  { row: 5, text: 'Fri' },
];

// "Mon, 12 Oct 2026"
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// "Oct"
function monthName(date) {
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
}

function ActivityHeatmap({ weeks }) {
  const scrollRef = useRef(null);
  const [activeDay, setActiveDay] = useState(null); // the day being pointed at

  // Side effect: start scrolled to the newest weeks (matters on phones).
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  // A month name goes above the first week in which that month starts.
  const monthLabels = [];
  weeks.forEach((week, i) => {
    const month = monthName(week[0].date);
    const previous = i > 0 ? monthName(weeks[i - 1][0].date) : null;
    if (i > 0 && month !== previous) {
      monthLabels.push({ column: i, text: month });
    }
  });

  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;

  let readout = 'Point at or tap a square to see that day.';
  if (activeDay) {
    const problems = activeDay.count === 1 ? 'problem' : 'problems';
    readout = `${activeDay.count} ${problems} solved on ${formatDate(activeDay.date)}`;
  }

  return (
    <div>
      {/* tabIndex lets keyboard users scroll the calendar with the arrow keys. */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="group"
        aria-label="Calendar of problems solved per day over the last year. Scrolls sideways."
        className="overflow-x-auto pb-1"
      >
        <svg
          width={width} height={height} className="block"
          role="img"
          aria-label="Calendar of daily problems solved over the last year."
          onPointerLeave={() => setActiveDay(null)}
        >
          {monthLabels.map((label) => (
            <text
              key={`${label.text}-${label.column}`}
              x={LEFT + label.column * STEP}
              y={10}
              className="fill-slate-500 text-[10px] dark:fill-slate-400"
            >
              {label.text}
            </text>
          ))}

          {WEEKDAY_LABELS.map((label) => (
            <text
              key={label.text}
              x={0}
              y={TOP + label.row * STEP + CELL - 2}
              className="fill-slate-500 text-[10px] dark:fill-slate-400"
            >
              {label.text}
            </text>
          ))}

          {weeks.map((week, w) =>
            week.map((day, d) => {
              // Days that have not happened yet are simply not drawn.
              if (day.isFuture) {
                return null;
              }
              const isActive = activeDay?.date === day.date;
              return (
                <rect
                  key={day.date}
                  x={LEFT + w * STEP}
                  y={TOP + d * STEP}
                  width={CELL}
                  height={CELL}
                  rx="2"
                  strokeWidth="1.5"
                  onPointerEnter={() => setActiveDay(day)}
                  onPointerDown={() => setActiveDay(day)}
                  className={`${LEVEL_CLASSES[activityLevel(day.count)]} ${
                    isActive ? 'stroke-slate-900 dark:stroke-white' : 'stroke-transparent'
                  }`}
                />
              );
            }),
          )}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
        {/* aria-live makes screen readers announce the readout when it changes. */}
        <p role="status" aria-atomic="true">{readout}</p>

        {/* The colour key. */}
        <div className="flex items-center gap-1.5">
          <span>Fewer</span>
          <svg width={5 * STEP - GAP} height={CELL} aria-hidden="true">
            {LEVEL_CLASSES.map((levelClass, i) => (
              <rect key={levelClass} x={i * STEP} y={0} width={CELL} height={CELL} rx="2" className={levelClass} />
            ))}
          </svg>
          <span>More</span>
        </div>
      </div>

    </div>
  );
}

export default ActivityHeatmap;
