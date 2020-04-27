import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey, getCmsBlocks, RenderCmsBlock } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';
import { useRouter } from 'next/router';

/*
* This is our catch all page, for example /faq would direct here
*/

const Page = ({pid}) => {
  let { state, dispatch } = useContext(CMSContext);
  let router = useRouter();
  let page = pid ? pid : router.query.pid;

  let blocks = getCmsBlocks(page, state);

  return <>
    {blocks.map(block => (
      <RenderCmsBlock key={block.key} block={block} />
    ))}
  </>
}

Page.getLayout = getLayout;

export default Page;