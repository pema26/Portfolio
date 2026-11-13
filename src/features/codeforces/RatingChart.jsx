// ============================================================================
//  RatingChart.jsx  —  the Codeforces rating over time, as a line chart
// ============================================================================
//
//  PURPOSE: one point per rated contest, joined by a line, so a visitor can
//  see the rating climbing. It is drawn by hand as an SVG — no chart library.
//
//  PROPS:
//    ratingChanges — the list from the Codeforces API (one item per contest).
//
//  HOW THE DRAWING WORKS: two small "scale" functions turn data into pixels.
//    xOf(time)   -> how far across the chart a date sits
//    yOf(rating) -> how far down the chart a rating sits
//  Everything else (grid lines, the line itself, the dots) just uses those.
//
//  INTERACTION: moving the pointer over the chart (or tabbing to a dot)
//  stores that contest's position in state, and the tooltip is rendered from
//  that state. The same numbers are always available in the table underneath,
//  so nothing depends on being able to hover.
//
//  RESPONSIVE: the chart measures its own container (a ref + a resize
//  listener) and redraws at that width, so text stays a readable size on
//  phones instead of shrinking with the picture.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { nextRank } from './codeforces';

const HEIGHT = 260;
const MARGIN = { top: 16, right: 52, bottom: 30, left: 44 };

// "7 Oct" for axis ticks, "7 Oct 2026" for the tooltip and table.
function formatDay(seconds, withYear) {
  return new Date(seconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

// "+60" / "-12" / "0"
function formatChange(change) {
  return change > 0 ? `+${change}` : `${change}`;
}

function RatingChart({ ratingChanges }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(640);
  const [activeIndex, setActiveIndex] = useState(null); // which contest is highlighted

  useEffect(() => {
    if (activeIndex === null) return;
    const dismiss = event => { if (event.key === 'Escape') setActiveIndex(null); };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [activeIndex]);

  // Side effect: measure the container now, and again whenever the window
  // is resized. The cleanup removes the listener.
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, []);

  // ---- the data, simplified to what the chart needs --------------------------
  const points = ratingChanges.map((change) => ({
    time: change.ratingUpdateTimeSeconds,
    rating: change.newRating,
    change: change.newRating - change.oldRating,
    contest: change.contestName,
    rank: change.rank,
  }));

  const ratings = points.map((point) => point.rating);
  const highest = Math.max(...ratings);
  const target = nextRank(highest); // the next rank to aim for, if any

  // ---- the scales ----------------------------------------------------------
  // Y axis: from a round number below the lowest rating up to just past the
  // next rank (so the goal line is always in view).
  const yMin = Math.max(0, Math.floor((Math.min(...ratings) - 100) / 200) * 200);
  const yMax = Math.ceil(((target ? target.rating : highest) + 100) / 200) * 200;

  // X axis: from the first contest to the last, with a little air either side.
  const firstTime = points[0].time;
  const lastTime = points[points.length - 1].time;
  const padding = Math.max((lastTime - firstTime) * 0.04, 24 * 60 * 60);
  const xMin = firstTime - padding;
  const xMax = lastTime + padding;

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 50);
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const xOf = (time) => MARGIN.left + ((time - xMin) / (xMax - xMin)) * plotWidth;
  const yOf = (rating) => MARGIN.top + (1 - (rating - yMin) / (yMax - yMin)) * plotHeight;

  // ---- axis ticks ------------------------------------------------------------
  const yTicks = [];
  for (let value = yMin; value <= yMax; value += 200) {
    yTicks.push(value);
  }

  // A handful of evenly spaced dates; fewer on narrow screens so they fit.
  const xTickCount = plotWidth < 360 ? 3 : 5;
  const xTicks = [];
  for (let i = 0; i < xTickCount; i++) {
    xTicks.push(firstTime + ((lastTime - firstTime) * i) / (xTickCount - 1));
  }

  // The line: "M x,y L x,y L x,y ..." is SVG's way of saying
  // "move to the first point, then draw a line to each of the others".
  const linePath = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${xOf(point.time)},${yOf(point.rating)}`)
    .join(' ');

  // ---- event handlers --------------------------------------------------------
  // Find the contest whose dot is closest (left-to-right) to the pointer.
  const handlePointerMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - box.left;
    let closest = 0;
    points.forEach((point, i) => {
      if (Math.abs(xOf(point.time) - pointerX) < Math.abs(xOf(points[closest].time) - pointerX)) {
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  const active = activeIndex === null ? null : points[activeIndex];
  const last = points[points.length - 1];

  return (
    <div>
      <div
        ref={containerRef} className="relative"
        onPointerLeave={() => {
          if (!containerRef.current.contains(document.activeElement)) handlePointerLeave();
        }}
      >
        <svg
          width={width}
          height={HEIGHT}
          role="group"
          aria-label={`Line chart of Codeforces rating after each of ${points.length} rated contests, from ${points[0].rating} to ${last.rating}.`}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          className="block touch-pan-y"
        >
          {/* Horizontal grid lines with the rating written at the left. */}
          {yTicks.map((value) => (
            <g key={value}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={yOf(value)}
                y2={yOf(value)}
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <text
                x={MARGIN.left - 8}
                y={yOf(value)}
                dy="0.32em"
                textAnchor="end"
                className="fill-slate-500 text-[11px] tabular-nums dark:fill-slate-400"
              >
                {value}
              </text>
            </g>
          ))}

          {/* The next rank, as a slightly stronger line with its name on it. */}
          {target && (
            <g>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={yOf(target.rating)}
                y2={yOf(target.rating)}
                className="stroke-slate-400 dark:stroke-slate-500"
              />
              <text
                x={MARGIN.left + 6}
                y={yOf(target.rating) - 6}
                className="fill-slate-500 text-[11px] dark:fill-slate-400"
              >
                Next rank: {target.name} at {target.rating}
              </text>
            </g>
          )}

          {/* Dates along the bottom. */}
          {xTicks.map((time) => (
            <text
              key={time}
              x={xOf(time)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-slate-500 text-[11px] dark:fill-slate-400"
            >
              {formatDay(time, false)}
            </text>
          ))}

          {/* A vertical hairline under the pointer. */}
          {active && (
            <line
              x1={xOf(active.time)}
              x2={xOf(active.time)}
              y1={MARGIN.top}
              y2={MARGIN.top + plotHeight}
              className="stroke-slate-400 dark:stroke-slate-500"
            />
          )}

          {/* The rating line. */}
          <path
            d={linePath}
            fill="none"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="stroke-accent-500"
          />

          {/* One dot per contest. The ring in the card's colour keeps a dot
              readable where it sits on the line. Dots can be reached with the
              Tab key, which shows the same tooltip as hovering. */}
          {points.map((point, i) => (
            <circle
              key={point.time}
              cx={xOf(point.time)}
              cy={yOf(point.rating)}
              r={i === activeIndex ? 6 : 4.5}
              strokeWidth="2"
              tabIndex={0}
              role="img"
              aria-label={`${point.contest}, ${formatDay(point.time, true)}: rating ${point.rating} (${formatChange(point.change)}), rank ${point.rank}`}
              onFocus={() => setActiveIndex(i)}
              onBlur={handlePointerLeave}
              className="fill-accent-500 stroke-white outline-none dark:stroke-slate-900"
            />
          ))}

          {/* The latest rating, written at the end of the line. */}
          <text
            x={xOf(last.time) + 10}
            y={yOf(last.rating)}
            dy="0.32em"
            className="fill-slate-900 text-xs font-semibold dark:fill-white"
          >
            {last.rating}
          </text>
        </svg>

        {/* The tooltip: an ordinary <div> placed over the chart. It flips to
            the left of the pointer in the right-hand half so it never falls
            off the edge. */}
        {active && (
          <div
            className="absolute z-10 w-56 max-w-full rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-800"
            style={{
              top: MARGIN.top,
              left: Math.max(0, Math.min(width - 224, xOf(active.time) > width / 2 ? xOf(active.time) - 236 : xOf(active.time) + 12)),
            }}
          >
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {active.rating}{' '}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                ({formatChange(active.change)})
              </span>
            </p>
            <p className="mt-1 text-slate-700 dark:text-slate-200">{active.contest}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {formatDay(active.time, true)} · rank {active.rank}
            </p>
          </div>
        )}
      </div>

      {/* The same data as a table, for anyone who cannot or would rather not
          read it off a chart. <details> is a built-in show/hide element. */}
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-slate-600 hover:text-link dark:text-slate-400">
          Show contests as a table
        </summary>
        <div tabIndex={0} role="region" aria-label="Scrollable contest results" className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-2 text-left font-semibold">Codeforces rated contest results</caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <th scope="col" className="py-2 pr-4 font-semibold">Contest</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">Rank</th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">Change</th>
                <th scope="col" className="py-2 text-right font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.time} className="border-b border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <td className="py-2 pr-4">{point.contest}</td>
                  <td className="whitespace-nowrap py-2 pr-4">{formatDay(point.time, true)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{point.rank}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatChange(point.change)}</td>
                  <td className="py-2 text-right tabular-nums">{point.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export default RatingChart;
