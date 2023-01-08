import '@sass/app.scss';
import 'nprogress/nprogress.css';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { store } from '@app/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
const NProgress = dynamic(() => import('@layouts/TopProgress'), { ssr: false });

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <Provider store={store}>
        <NProgress />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default CustomApp;
