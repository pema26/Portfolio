// ============================================================================
//  src/features/codeforces/useCodeforces.js: custom hook: load a live Codeforces profile
// ============================================================================
//
//  PURPOSE: fetches a user's profile, rating history and submissions from the
//  Codeforces API when the component first appears, and reports how that is
//  going with the three usual pieces of data-fetching state:
//
//      const { data, loading, error } = useCodeforces('Vasta');
//
//    data: null until the answer arrives, then
//              { user, ratingChanges, submissions, loadedAt }
//    loading: true while we are still waiting
//    error: null, or the Error if the request failed
//
//  Fetching is a side effect, so it lives in useEffect. The `ignore` flag
//  stops us from updating state if the visitor leaves the page before the
//  answer comes back.
// ============================================================================

import { useEffect, useState } from 'react';
import { fetchCodeforcesProfile } from './codeforces';

export function useCodeforces(handle) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const profile = await fetchCodeforcesProfile(handle);
        if (!ignore) {
          // Remember WHEN the data arrived ("now", in Unix seconds) so that
          // "last 30 days" style numbers have a fixed point to count from.
          setData({ ...profile, loadedAt: Math.floor(Date.now() / 1000) });
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [handle]);

  return { data, loading, error };
}
