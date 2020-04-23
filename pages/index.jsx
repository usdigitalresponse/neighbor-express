import React, { useContext } from 'react';
import Interweave from 'interweave';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey, getCmsBlocks, RenderCmsBlock } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';
import Button from '@/components/Button';

const HomePage = () => {
  let { state, dispatch } = useContext(CMSContext);
  let blocks = getCmsBlocks('home', state);

  return <>
    {blocks.map(block => (
      <RenderCmsBlock key={block.key} block={block} />
    ))}
  </>
};

HomePage.getLayout = getLayout;
export default HomePage;