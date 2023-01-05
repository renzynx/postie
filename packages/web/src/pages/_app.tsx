import '@styles/globals.scss';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { store } from '@app/store';
import { Provider } from 'react-redux';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default CustomApp;
