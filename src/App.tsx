import { HashRouter } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import ResponseError from '@/libs/response-error';
import { getTokenFromUrl, setTokenToStorage } from '@/libs/utils';
import Pages from '@/pages/Root';
import { ThemeProvider } from '@/components/modules/theme-provider';
import Alert from '@/components/modules/dialog/alert';
import Confirm from '@/components/modules/dialog/confirm';
import Spinner from '@/components/modules/spinner';
import { useTheme } from '@/components/modules/theme-provider';

ModuleRegistry.registerModules([AllCommunityModule]);

function AppContent() {
  const { setTheme } = useTheme();
  const lockedOriginRef = useRef<string | null>(null);

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      setTokenToStorage(token);
    }
  }, []);

  useEffect(() => {
    const safeGetOrigin = (value?: string | null) => {
      try {
        return value ? new URL(value).origin : '';
      } catch {
        return '';
      }
    };

    // 세션에 저장된 이전 락 값을 복원
    lockedOriginRef.current =
      sessionStorage.getItem('parent_origin_locked') || lockedOriginRef.current;

    const expected =
      safeGetOrigin(new URLSearchParams(window.location.search).get('parent_origin')) ||
      safeGetOrigin((import.meta as any).env?.VITE_PARENT_ORIGIN as string | undefined);

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;

      const { type, theme: newTheme } = (event.data ?? {}) as any;

      // origin 검증/락
      let allow = false;
      if (expected) {
        allow = event.origin === expected;
      } else if (!lockedOriginRef.current) {
        // 최초 유효 메시지(THEME_CHANGE)의 origin을 락으로 저장
        if (type === 'THEME_CHANGE') {
          lockedOriginRef.current = event.origin;
          (window as any).__PARENT_ORIGIN = event.origin;
          sessionStorage.setItem('parent_origin_locked', event.origin);
          allow = true;
        }
      } else {
        allow = event.origin === lockedOriginRef.current;
      }

      if (!allow) return;

      if (type === 'THEME_CHANGE') setTheme(newTheme);
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setTheme]);

  return (
    <HashRouter>
      <Spinner />
      <Alert />
      <Confirm />
      <Pages />
    </HashRouter>
  );
}

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (e) => {
        if (e instanceof ResponseError) console.log(e);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
