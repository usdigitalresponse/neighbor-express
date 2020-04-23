import React, { useContext } from 'react';
import Interweave from 'interweave';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey, getCmsBlocks, RenderCmsBlock } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';
import Button from '@/components/Button';

const HomePage = () => {
  let { state, dispatch } = useContext(CMSContext);

  const hero = getCmsRecordFromKey('hero', state);
  const how = getCmsRecordFromKey('how_does_this_work', state);
  const cta = getCmsRecordFromKey('cta', state);
  const serving = getCmsRecordFromKey('currently_serving', state);
  const button_one = getCmsRecordFromKey('hero_button_one', state);
  const button_two = getCmsRecordFromKey('hero_button_two', state);


  let blocks = getCmsBlocks('home', state);

  return <>
    {blocks.map(block => (
      <RenderCmsBlock key={block.key} block={block} />
    ))}
  </>
};

HomePage.getLayout = getLayout;
export default HomePage;