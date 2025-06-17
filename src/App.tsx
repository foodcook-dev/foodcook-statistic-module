import { BrowserRouter } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResponseError from '@/libs/responseError';
import Pages from '@/pages/Root';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  // const commonErrorHandle = useGlobalRejectHandler();
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

  // useEffect(() => {
  //   window.onbeforeunload = function pushRefresh() {
  //     window.scrollTo(0, 0);
  //   };
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
