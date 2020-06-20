import React, { useContext } from 'react';
import { getCmsRecordFromKey, getCmsBlocks, RenderCmsBlock, processRecords } from '../utils/cms';
import NeighborLayout from '../layouts/neighbor.jsx';
import { useRouter } from 'next/router';
import { CMSContextProvider, CMSContext } from '@/context/cms.js';

const Blocks = ({ page }) => {
  let { state, dispatch } = useContext(CMSContext);
  if (!state) return null;
  let blocks = getCmsBlocks(page, state);
  return (
    <>
      {blocks.map((block) => (
        <RenderCmsBlock key={block.key} block={block} />
      ))}
    </>
  );
};

const Page = ({ records }) => {
  let page = 'home';
  if (!records) {
    return null;
  }

  return (
    <>
      <CMSContextProvider records={records}>
        <NeighborLayout>
          <Blocks page={page} />
        </NeighborLayout>
      </CMSContextProvider>
    </>
  );
};


export async function getStaticProps({ params }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const json = await fetch('http://localhost:3000/api/get-cms')
    .then((res) => res.json())
    .then((json) => json.records);

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      records: processRecords(json, { language: 'en' }),
    },
  };
}

export default Page;
