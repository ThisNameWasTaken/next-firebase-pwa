import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightTheme } from '../theme';
import Head from 'next/head';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  function calcVh() {
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    window.addEventListener('resize', calcVh);
    calcVh();

    return function cleanup() {
      window.removeEventListener('resize', calcVh);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Chatr</title>
      </Head>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
