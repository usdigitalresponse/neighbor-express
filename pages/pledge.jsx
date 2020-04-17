import React, { useContext } from 'react';
import Interweave from 'interweave';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey } from '../utils/cms';
import { getLayout } from '../layouts/neighbor.jsx';

const Pledge = () => {
  let { state, dispatch } = useContext(CMSContext);

  const content = getCmsRecordFromKey('pledge', state);

  return (
    <section className="grid-container usa-section" id="share">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8 usa-prose">
          <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
            {content.title}
          </h2>
          <p>
            <Interweave content={content.body} />
          </p>
        </div>
      </div>
    </section>
  );
};

Pledge.getLayout = getLayout;

export default Pledge;
