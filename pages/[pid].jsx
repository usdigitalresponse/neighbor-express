import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey, getCmsBlocks, RenderCmsBlock } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

/*
* This is our catch all page, for example /faq would direct here
*/

const Page = ({pid}) => {
  let { state, dispatch } = useContext(CMSContext);
  let router = useRouter();
  let page = pid ? pid : router.query.pid;

  let blocks = getCmsBlocks(page, state);

  return <>
     <NextSeo
      title="Neighbor Express"
      description="Request free meals, order your usual groceries, or ask for other help you may need. A volunteer will bring your delivery right to your door."
    />
    {blocks.map(block => (
      <RenderCmsBlock key={block.key} block={block} />
    ))}
  </>
}

Page.getLayout = getLayout;

export default Page;