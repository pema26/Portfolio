import { useEffect, useState } from 'react';
import { MotionContext } from '../contexts/MotionContext';

const QUERY = '(prefers-reduced-motion: reduce)';
const STORAGE_KEY = 'reduced-motion';

function storedPreference() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
  catch { return false; }
}

export default function MotionProvider({ children }) {
  const [userReduced, setUserReduced] = useState(storedPreference);
  const [systemReduced, setSystemReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );
  const reducedMotion = userReduced || systemReduced;

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    try { localStorage.setItem(STORAGE_KEY, String(userReduced)); }
    catch { /* Motion controls still work when storage is unavailable. */ }
  }, [reducedMotion, userReduced]);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const onSystemChange = () => setSystemReduced(query.matches);
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setUserReduced(storedPreference());
    };
    query.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
    return () => {
      query.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ reducedMotion, systemReduced, toggleMotion: () => setUserReduced(value => !value) }}>
      {children}
    </MotionContext.Provider>
  );
}
