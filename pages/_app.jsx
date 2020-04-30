import React, { useEffect, useState, useContext } from 'react';
import NeighborLayout from '../layouts/neighbor.jsx';
import { CMSContextProvider, CMSContext } from '@/context/cms.js';
import { getCmsRecordFromKey, processRecords } from '@/utils/cms';
import './styles.css';
import { NextSeo } from 'next-seo';


function NeighborExpress({ children }) {
  let { state, dispatch } = useContext(CMSContext);

  useEffect(() => {
    fetch('/api/get-cms').then((res) => res.json()).then((json) => json.records).then((records) => {
      dispatch({ type: 'set-records', payload: processRecords(records, state) });
    });
  }, []);

  return <NeighborLayout>
    {children}
  </NeighborLayout>
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

  }

  render() {
    if (this.state.hasError) {
      return 'Internal Error.';
    }

    return this.props.children;
  }
}

function CustomSeo() {
  let { state, dispatch } = useContext(CMSContext);
  const title = getCmsRecordFromKey('title', state);
  const openGraph = title ? {
    title: title.title,
    description: title.body
  } : null;
  return (title ?  <NextSeo
    title={title.title}
    description={title.body}
    openGraph={openGraph}
  /> : null)

}


function App({ Component, pageProps }) {
  return (
    <>
    <ErrorBoundary>
      <CMSContextProvider>
        <CustomSeo />
        <NeighborExpress>
          <Component {...pageProps} />
        </NeighborExpress>
      </CMSContextProvider>
    </ErrorBoundary>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App;
