import { useContext } from 'react';
import { MotionContext } from './MotionContext';

export function useMotion() {
  return useContext(MotionContext);
}
