import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location]);

  return null;
}
