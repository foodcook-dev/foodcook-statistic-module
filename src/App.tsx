import { HashRouter } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Pages from '@/pages/Root';
import ResponseError from '@/libs/response-error';
import { getTokenFromUrl, setTokenToStorage } from '@/utils/token';
import { ThemeProvider } from '@/components/modules/theme-provider';
import Alert from '@/components/modules/dialog/alert';
import Confirm from '@/components/modules/dialog/confirm';
import Spinner from '@/components/modules/spinner';
import { useParentOriginMessage } from '@/hooks/useParentOriginMessage';

ModuleRegistry.registerModules([AllCommunityModule]);

function AppContent() {
  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) setTokenToStorage(token);
  }, []);

  useParentOriginMessage();

  return (
    <HashRouter>
      <Spinner />
      <Alert />
      <Confirm />
      <Pages />
      <ToastContainer />
    </HashRouter>
  );
}

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
