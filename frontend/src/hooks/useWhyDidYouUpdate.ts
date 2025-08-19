import { useEffect, useRef } from 'react';

export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const prevProps = useRef(props);
  useEffect(() => {
    const allKeys = Object.keys({ ...prevProps.current, ...props });
    const changesObj: Record<string, { from: any; to: any }> = {};
    allKeys.forEach(key => {
      if (prevProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: prevProps.current[key],
          to: props[key],
        };
      }
    });
    if (Object.keys(changesObj).length) {
      console.log('[why-did-you-update]', name, changesObj);
    }
    prevProps.current = props;
  });
} 