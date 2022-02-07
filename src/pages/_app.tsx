import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/scss/main.scss';
import 'react-datepicker/dist/react-datepicker.css';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from '../components/ui/Layout';
const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
};
export default MyApp;
