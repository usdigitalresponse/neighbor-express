import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey, getCmsBlocks } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';
import { useRouter } from 'next/router';

/*
* This is our catch all page, for example /faq would direct here
*/

const Page = () => {
  let { state, dispatch } = useContext(CMSContext);
  let router = useRouter();

  let page = router.query.pid;
  let blocks = getCmsBlocks(page, state);

  console.log('blocks', blocks);

  return <section className="grid-container usa-section" id="share">
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-8 usa-prose">
        <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
          this is a page
          </h2>
        <p>
          it has a name
          </p>
      </div>
    </div>
  </section>
}

Page.getLayout = getLayout;

export default Page;