import { useEffect } from 'react';
import { useTheme } from '../../context/dashboard/ThemeContext';

export default function FaviconManager() {
  const { theme } = useTheme();

  useEffect(() => {
    const updateFavicon = () => {
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      if (favicon) {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = systemPrefersDark || theme === 'dark';
        
        favicon.href = shouldUseDark 
          ? '/LOGO-ADR-favicon-dark.ico' 
          : '/LOGO-ADR-favicon.ico';
      }
    };

    updateFavicon();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateFavicon);

    return () => {
      mediaQuery.removeEventListener('change', updateFavicon);
    };
  }, [theme]);

  return null;
}
