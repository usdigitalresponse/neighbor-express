import { useState, useRef } from 'react';
import Text from '@/components/Text';
import Hero from '@/components/Hero';
import HeroWithButtons from '@/components/HeroWithButtons';
import Form from '@/components/Form';
import Button from '@/components/Button';
import QuotesCarousel from '@/components/QuotesCarousel';
import List from '@/components/List';
import Columns from '@/components/Columns';
import YouTube from '@/components/YouTube';
import Photo from '@/components/Photo';
import reactStringReplace from 'react-string-replace';
import Link from 'next/link'
import { useOnClickOutside } from "react-recipes";
import Markdown from 'markdown-to-jsx';


/**
* Outputs the requested field of a record depending on the language of the user
* Defaults to english
*/
function getRecordField (record, fieldName, language = 'en') {
  const field = record[`${fieldName}_${language}`] || record[`${fieldName}`];
  return field;
}

/** 
* This takes the 'languages' column and transforms it into something useful
* For the footer to display the languge options
* They are formatted like this:
* English:en,Spanish:es
*/
export function getRecordLanguages(state) {
  const languages = getCmsRecordFromKey('languages', state);
  if (!languages.data)
    return [{ name: 'English', key: 'en' }];
  const options = languages.data.split(',');
  return options.map(option => {
    const data = option.split(':');
    return { name: data[0], key: data[1] };
  });
}

/**
 *
 */

export function getCmsBlocks(page, state) {
  return state.records.filter(record => { return record.tag?.includes(page) && record.enabled; });
}


export function getCmsPages(state) {
  return state.records.filter(record => { return record.type === 'page' && record.enabled })
}


export function getCmsNav(state) {
  return state.records.filter(record => { return record.type === 'nav' && record.enabled })
}


const AccordionNav = ({nav, pages}) => {
  const [open, setOpen] = useState(false);
  const aria_id = `basic-nav-section-${nav.key}`;
  // Create a ref that we add to the element for which we want to detect outside clicks
  const ref = useRef();

  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, () => setOpen(false));

  const menuOpenStyles = {
    display: open ? 'inline' : ''
  }
  return <li key={nav.key} className="usa-nav__primary-item" ref={ref}>
    <button className="usa-accordion__button usa-nav__link"
            aria-expanded={open}
            aria-controls={aria_id}
            onClick={() => setOpen(!open)}>
    <span>{nav.title}</span></button>
    {open && <ul id={aria_id} className="usa-nav__submenu">
      {
        pages.map((page) => {
          return <li className="usa-nav__submenu-item" key={page.key}>
            <Link href="/[pid]" as={`/${page.key}`}>
              <a className="usa-nav__link" href={`/${page.key}`}><span>{page.title}</span></a>
            </Link>
          </li>
        })
      }
    </ul>}
  </li>
}

export const RenderNavLinks = ({navs, pages}) => {
  return <ul className="usa-nav__primary usa-accordion">
      {
        navs.length == 0 ?
        pages.map(page => {
        return <li key={page.key} className="usa-nav__primary-item">
            <Link href="/[pid]" as={`/${page.key}`}><a className="usa-nav__link" href={`/${page.key}`}><span>{page.title}</span></a></Link>
          </li>
        }) :
        navs.map((nav) => {
          const pageKeys = nav.data.split(",");
          const this_pages = pages.filter(record => {return pageKeys.includes(record.key)});
          if (this_pages.length == 1) {
            const page = this_pages[0];
            return <li key={nav.key} className="usa-nav__primary-item">
              <Link href="/[pid]" as={`/${page.key}`}><a className="usa-nav__link" href={`/${page.key}`}><span>{nav.title}</span></a></Link>
            </li>
          } else {
            return <AccordionNav key={nav.key} nav={nav} pages={this_pages}/>
          }
        })

      }
    </ul>
}

/**
 * Right now this is a simple switch, to display a component (hero, text block, etc)
 */
export const RenderCmsBlock = ({ block }) => {
  return <>
    {{
      'block-text': <Text block={block} />,
      'block-hero': <Hero block={block} />,
      'block-hero-button': <HeroWithButtons block={block} />,
      'block-form': <Form block={block} />,
      'block-quote': <QuotesCarousel block={block} />,
      'block-list': <List block={block} />,
      'block-columns': <Columns block={block} />,
      'block-youtube': <YouTube block={block} />,
      'block-photo': <Photo block={block} />,
    }[block.type]}</>
}

/**
 * Right now this is a simple switch, to display an element (button, link, etc)
 */
export const RenderCmsElement = ({ Element }) => {
  return <>
    {{
      'component-button': <Button />,
    }[block.type]}</>
}
/**
* We're going to look up a particular key in our CMS state and
* run some filters on the data, before returning it to the page
*/
export const getCmsRecordFromKey = (key, state, required = true) => {
  const { records, language } = state;

  const filteredRecords = records.filter(record => record.key === key && record.enabled);

  if (filteredRecords.length == 0) {
    if (required) {
      console.error(`❗ Missing ${key} value in CMS`, records);
    }
    return undefined;
  }

  if (filteredRecords.length > 1) {
    console.warn(`❗ Duplicate ${key} value in CMS, using first one`, records);
  }

  const record = filteredRecords[0];

  if (!record.key) {
    console.error(`The CMS was set up incorrectly and is missing a "key" column. Check that the column name is not "Name"!`);
  }

  return record;
}

export const processRecords = (records, state) => {
  const { language } = state;
  return records.map(record => {
    // We're going to make a helper for the picture column
    record.image = record.picture[0]?.url;
    record.body = getRecordField(record, 'body', language);
    record.body_markdown = <Markdown>{record.body || ""}</Markdown>;
    record.title = getRecordField(record, 'title', language);
    record.alt = getRecordField(record, 'alt', language);
    return record;
  });
}