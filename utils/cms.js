import Text from '@/components/Text';
import Hero from '@/components/Hero';
import HeroWithButtons from '@/components/HeroWithButtons';
import Form from '@/components/Form';
import Button from '@/components/Button';
import reactStringReplace from 'react-string-replace';

import Markdown from 'markdown-to-jsx';

/**
* Outputs the body of a record depending on the language of the user
* and then formats it with a markdown processor
* Defaults to english
*/
export function getRecordBody(record, language = 'en') {
  const body = record[`body_${language}`] || record[`body_en`];
  return body;
}

/**
* Outputs the title of a record depending on the language of the user
* Defaults to english
*/
export function getRecordTitle(record, language = 'en') {
  const title = record[`title_${language}`] || record[`title`];
  return title;
}

/** 
* This takes the 'languages' column and transforms it into something useful
* For the footer to display the languge options
* They are formatted like this:
* English:en,Spanish:es
*/
export function getRecordLanguages(state) {
  const options = getCmsRecordFromKey('languages', state).data.split(',');
  if (!options) return [];
  return options.map(option => {
    const data = option.split(':');
    return { name: data[0], key: data[1] };
  });
}

/**
 *
 */

export function getCmsBlocks(page, state) {
  return state.records.filter(record => { return record.tag?.includes(page); });
}


export function getCmsPages(state) {
  return state.records.filter(record => { return record.type === 'page' && record.enabled })
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
export const getCmsRecordFromKey = (key, state) => {
  const { records, language } = state;

  const record = records.filter(record => record.key === key)[0];

  if (!record) {
    console.error(`❗ Missing ${key} value in CMS`, records);
    return {};
  }

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
    record.body = getRecordBody(record, language);
    record.body_markdown = <Markdown>{record.body || ""}</Markdown>;
    record.title = getRecordTitle(record, language);
    return record;
  });
}