import React, { useEffect, useState } from 'react';
import NeighborLayout from '../layouts/neighbor.jsx'
import cmsContext from '../context/cms.js'
import './styles.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return "Internal Error.";
    }

    return this.props.children;
  }
}

const ErrorTemplate = () => {
  // ReferenceError: foo is not defined.
  return "OK";
};

function MyApp({ Component, pageProps }) {
  const [cms, setcms] = useState([]);

  useEffect(() => {
    fetch('/api/get-cms').then(res => res.json()).then(json => json.records).then(records => {
      setcms(records);
      console.log('records', records);
    });
  }, []);

  if (!cms) return null;
  return <ErrorBoundary><cmsContext.Provider value={cms}>
    <NeighborLayout>
      <Component {...pageProps} />
    </NeighborLayout>
  </cmsContext.Provider></ErrorBoundary>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
