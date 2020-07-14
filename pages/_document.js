import 'default-passive-events';
import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

import { lightTheme } from '../theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap"
            rel="stylesheet"
          />

          <meta name="theme-color" content={lightTheme.palette.primary.main} />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            href="/launcher-icons/launcher-icon-144x144.png"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => {
    return originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });
  };

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
