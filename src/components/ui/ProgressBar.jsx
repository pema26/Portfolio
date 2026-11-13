// ============================================================================
//  ProgressBar.jsx  —  a thin "how far along" bar for guided builds
// ============================================================================
//
//  PURPOSE: shows a percent-complete bar (with an accessible label) for a
//  guided build you're working through. Used on project cards and on the
//  project page. Set the number via the `progress` field of a project.
//
//  PROPS:
//    value — 0 to 100.
//    large — slightly taller bar when true (used on the project page).
// ============================================================================

function ProgressBar({ value, large = false }) {
  // Clamp defensively so a stray value never overflows the track.
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-link">In&nbsp;progress</span>
        <span className="font-medium text-slate-600 tabular-nums dark:text-slate-400">{pct}%</span>
      </div>
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${large ? 'h-2.5' : 'h-1.5'}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progress: ${pct}% complete`}
      >
        {/* The filled part. Its width comes from the data, so it is an inline style. */}
        <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

export default ProgressBar;
