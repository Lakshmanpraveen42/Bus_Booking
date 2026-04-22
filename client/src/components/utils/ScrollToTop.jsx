import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that scrolls the window to the top 
 * whenever the route path changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
