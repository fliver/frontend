import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';

import CartContextProvider from '../src/contexts/CartContext';
import BusinessContextProvider from '../src/contexts/BusinessContext';
import ProductFeedContextProvider from '../src/contexts/ProductFeedContext';
import UserContextProvider from '../src/contexts/UserContext';
import UserAdmContextProvider from '../src/contexts/AuthAdmContext';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        {/* <title>My page</title> */}
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ProductFeedContextProvider>
          <CartContextProvider>
            <UserContextProvider>
              <UserAdmContextProvider>
                <BusinessContextProvider>
                  <Component {...pageProps} />
                </BusinessContextProvider>
              </UserAdmContextProvider>
            </UserContextProvider>
          </CartContextProvider>
        </ProductFeedContextProvider>
      </ThemeProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
