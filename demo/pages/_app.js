import React from 'react';
import Head from 'next/head';
import GlobalStyle from '../components/GlobalStyle';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React Live Demo</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
