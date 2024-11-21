import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDemoRouter(initialPath: string) {
  const navigate = useNavigate();

  const router = useMemo(() => {
    return {
      pathname: window.location.pathname,
      searchParams: new URLSearchParams(window.location.search),
      navigate: (path: string | URL) => navigate(String(path)),
    };
  }, [navigate]);

  return router;
}
