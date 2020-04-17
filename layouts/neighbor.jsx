import React, { useContext, useState } from 'react';
import Head from 'next/head';
import cmsContext from '../context/cms';
import Link from 'next/link'

const getCmsRecordFromKey = (key, records) => {
  return records.filter(record => record.key === key)[0];
}


const NeighborLayout = ({ children }) => {
  const cms = useContext(cmsContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (cms.length === 0) return null;

  const title = getCmsRecordFromKey('brand', cms);
  const cta = getCmsRecordFromKey('header_cta', cms);
  const footer = getCmsRecordFromKey('contact', cms);

  const menuOpenStyles = {
    display: isMenuOpen ? 'inline' : 'none'
  }

  return <div>
    <Head>
      <title>{title.body_en}</title>
      <meta name="description" content="Request free meals, order your usual groceries, or ask for other help you may need. A volunteer will bring your delivery right to your door." />
      <link id="favicon" rel="icon" href="https://glitch.com/favicon.ico" type="image/x-icon" />
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/2.6.0/css/uswds.min.css" />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/reset.css" />
    </Head>
    <a className="usa-skipnav" href="#main-content">Skip to main content</a>
    <div className="usa-overlay"></div>
    <header className="usa-header usa-header--basic ">
      <div className="usa-nav-container maxw-widescreen">
        <div className="usa-navbar">
          <div className="usa-logo" id="brand">
            <em className="usa-logo__text"><Link href="/"><a href="/" title="Home" aria-label="Home">{title.body_en}</a></Link></em>
          </div>
          <button className="usa-menu-btn" onClick={() => setIsMenuOpen(true)}>Menu</button>
        </div>
        <nav aria-label="Primary navigation" className="usa-nav" style={menuOpenStyles}>
          <button className="usa-nav__close" onClick={() => setIsMenuOpen(false)}>
            <img src="/assets/img/close.svg" alt="close" />
          </button>
          <ul className="usa-nav__primary usa-accordion">
            <li className="usa-nav__primary-item">
              <Link href="/about"><a className="usa-nav__link" href="/about"><span>About</span></a></Link>
            </li>
            <li className="usa-nav__primary-item">
              <Link href="/share"><a className="usa-nav__link" href="/share"><span>Share</span></a></Link>
            </li>
            <li className="usa-nav__primary-item">
              <Link href="/pledge"><a className="usa-nav__link" href="/pledge"><span>Volunteer Pledge</span></a></Link>
            </li>
            <li className="usa-nav__primary-item">
              <Link href="/volunteer"><a className="usa-nav__link" href="/volunteer"><span>Sign Up to Volunteer</span></a></Link>
            </li>
          </ul>
          <Link href="/request"><a className="usa-button" href="/request">
            {cta.body_en}
          </a>
          </Link>
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
              <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/about">About</a>
              </li>
              <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/share">Share</a>
              </li>
              <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/pledge">Volunteer Pledge</a>
              </li>
              <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/volunteer">Sign up to volunteer</a>
              </li>
              <li className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content">
                <a className="usa-footer__primary-link" href="/request">Request a delivery</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="usa-footer__secondary-section">
          <div className="grid-container">
            <div className="grid-row grid-gap">
              <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
                <div className="mobile-lg:grid-col-auto">
                  <h3 className="usa-footer__logo-heading">Neighbor Express</h3>
                </div>
              </div>
              <div className="usa-footer__contact-links mobile-lg:grid-col-6">
                <h3 className="usa-footer__contact-heading">{footer?.title}</h3>
                <address className="usa-footer__address">
                  <div className="usa-footer__contact-info grid-row grid-gap">
                    <div className="grid-col-auto">
                      {footer?.body_en}
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