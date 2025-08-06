import { HashRouter } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      setTokenToStorage(token);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, theme: newTheme } = event.data;
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
