import { useMotion } from './useMotion';

export default function MotionToggle() {
  const { reducedMotion, systemReduced, toggleMotion } = useMotion();
  const label = systemReduced ? 'Reduce motion (enabled by your device)' : 'Reduce motion';

  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-label={label}
      aria-pressed={reducedMotion}
      disabled={systemReduced}
      title={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {reducedMotion ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M8 5v14M16 5v14" />}
      </svg>
    </button>
  );
}
