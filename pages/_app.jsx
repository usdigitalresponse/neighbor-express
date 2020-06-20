import React, { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import NeighborLayout from '../layouts/neighbor.jsx';
import { getCmsRecordFromKey, processRecords } from '@/utils/cms';
import { CMSContextProvider, CMSContext } from '@/context/cms.js';
import NProgress from 'nprogress';
import './styles.css';
import { NextSeo } from 'next-seo';
import * as gtag from '../utils/ganalytics';

function NeighborExpress({ children }) {
	useEffect(() => {
		const handleRouteChange = (url) => {
			gtag.pageview(url);
			NProgress.done();
		};
		Router.events.on('routeChangeStart', (url) => {
			NProgress.start();
		});
		Router.events.on('routeChangeComplete', handleRouteChange);
		Router.events.on('routeChangeError', () => NProgress.done());
		return () => {
			Router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, []);

	// useEffect(() => {
	// 	fetch('/api/get-cms')
	// 		.then((res) => res.json())
	// 		.then((json) => json.records)
	// 		.then((records) => {
	// 			dispatch({ type: 'set-records', payload: processRecords(records, state) });
	// 		});
	// }, []);

	return <>{children}</>;
}

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {}

	render() {
		if (this.state.hasError) {
			return 'Internal Error.';
		}

		return this.props.children;
	}
}

function App({ Component, pageProps, records }) {
	return (
		<ErrorBoundary>
			<NeighborExpress>
				<Component {...pageProps} />
			</NeighborExpress>
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
