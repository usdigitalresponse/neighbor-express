import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { CMSContext } from '@/context/cms';
import Button from '@/components/Button';
import Link from 'next/link';
import { getCmsRecordFromKey, getRecordLanguages, getCmsPages, getCmsNav, RenderNavLinks } from '@/utils/cms';
import styles from './Neighbor.module.css'
const classNames = require('classnames');

const NeighborLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let { state, dispatch } = useContext(CMSContext);

  // TODO: Put a loader here
  if (state.records.length === 0) return null;

  const title = getCmsRecordFromKey('title', state);
  const brand = getCmsRecordFromKey('brand', state);
  const cta = getCmsRecordFromKey('header_cta', state, false /*required*/);
  const contact = getCmsRecordFromKey('contact', state);
  const languages = getRecordLanguages(state);
  const pages = getCmsPages(state);
  const nav = getCmsNav(state);

  const setLanguage = (language) => {
    dispatch({ type: 'set-language', payload: language });
  }

  const menuOpenStyles = {
    display: isMenuOpen ? 'inline' : ''
  }

  return <div>
    <Head>
      <title>{title.title}</title>
      <meta name="description" content={title.body} />
      {title.image && <link id="favicon" rel="icon" href={title.image} type="image/x-icon" />}
      <meta charset="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <a className="usa-skipnav" href="#main-content">Skip to main content</a>
    <div className="usa-overlay"></div>
    <header className="usa-header usa-header--basic ">
      <div className="usa-nav-container maxw-widescreen">
        <div className="usa-navbar">
          {/* Leftnav includes the main logo and the language switcher. */}
          <div className={styles.leftnav}>
            <div className="usa-logo" id="brand">
              <em className="usa-logo__text"><Link href="/"><a href="/" title="Home" aria-label="Home">{brand.body}</a></Link></em>
            </div>
            <select onChange={(e) => setLanguage(e.target.value)} className={`usa-select ${styles.select}`}
                    aria-label="Language"
                    name="options" id="options" value={state.language.key}>
              {languages.map(language => (
                <option key={language.key} value={language.key}>{language.name}</option>
              ))}
            </select>
          </div> 
          <button className="usa-menu-btn" onClick={() => setIsMenuOpen(true)}>Menu</button>
        </div>
        <nav aria-label="Primary navigation" className="usa-nav" style={menuOpenStyles}>
          <button className="usa-nav__close" onClick={() => setIsMenuOpen(false)}>
            <img src="/img/close.svg" alt="close" />
          </button>
          {
            <RenderNavLinks key="nav" navs={nav} pages={pages} />
          }
          { cta && <Button href={cta.href}>{cta.body}</Button> }
        </nav>
      </div>
    </header>
    <main>
      {children}
      <footer className="usa-footer">
        <div className="grid-container usa-footer__return-to-top">
          <a href="#">Return to top</a>
        </div>
        <div className="usa-footer__primary-section">
          <nav className="usa-footer__nav" aria-label="Footer navigation">
            <ul className="grid-row grid-gap">
              {pages.map(page => (
                <li key={page.key} className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                  <Link href="/[pid]" as={`/${page.key}`}>
                    <a className="usa-footer__primary-link" href={`/${page.key}`}>{page.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="usa-footer__secondary-section">
          <div className="grid-container">
            <div className="grid-row grid-gap">
              <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
                <div className="mobile-lg:grid-col-auto">
                  <h3 className="usa-footer__logo-heading">{brand.body}</h3>
                </div>
              </div>
              <div className="usa-footer__contact-links mobile-lg:grid-col-6">
                <h3 className="usa-footer__contact-heading">{contact.title}</h3>
                <address className="usa-footer__address">
                  <div className="usa-footer__contact-info grid-row grid-gap">
                    <div className="grid-col-auto">
                      {contact.body_markdown}
                    </div>
                  </div>
                </address>
              </div>
            </div>
          </div>
        </div>
      </footer></main>
  </div>
}

export const getLayout = page => <NeighborLayout>{page}</NeighborLayout>

export default NeighborLayout;