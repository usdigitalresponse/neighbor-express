import React, { useEffect, useState } from 'react';
import NeighborLayout from '../layouts/neighbor.jsx'
import cmsContext from '../context/cms.js'
import './styles.css'

function MyApp({ Component, pageProps }) {
  const [cms, setcms] = useState([]);

  useEffect(() => {
    fetch('/api/get-cms').then(res => res.json()).then(json => json.records).then(records => {
      setcms(records);
    });
  }, []);

  if (!cms) return null;
  return <cmsContext.Provider value={cms}>
    <NeighborLayout>
      <Component {...pageProps} />
    </NeighborLayout>
  </cmsContext.Provider>
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
