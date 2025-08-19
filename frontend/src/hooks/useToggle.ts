import { useCallback, useState } from 'react';

export function useToggle(initial = false): [boolean, () => void, () => void] {
  const [on, setOn] = useState(initial);
  const open = useCallback(() => setOn(true), []);
  const close = useCallback(() => setOn(false), []);
  return [on, open, close];
} 