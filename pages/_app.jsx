import React, { useEffect, useState, useContext } from 'react';
import NeighborLayout from '../layouts/neighbor.jsx';
import { CMSContextProvider, CMSContext } from '@/context/cms.js';
import { processRecords } from '@/utils/cms';
import './styles.css';


function NeighborExpress({ children }) {
  let { state, dispatch } = useContext(CMSContext);

  useEffect(() => {
    import('../cms-cache.json').then((json) => json.records).then((records) => {
      dispatch({ type: 'set-cached-records', payload: processRecords(records, state) })
    });

    console.log('starting fetch');
    fetch('/api/get-cms').then((res) => res.json()).then((json) => json.records).then((records) => {
      console.log('simulating fetch taking a long time');
      setTimeout(() => {
        dispatch({ type: 'set-records', payload: processRecords(records, state) })
        console.log("done with fetch");
      }, 3000)
      
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

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <CMSContextProvider>
        <NeighborExpress>
          <Component {...pageProps} />
        </NeighborExpress>
      </CMSContextProvider>
    </ErrorBoundary>
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
