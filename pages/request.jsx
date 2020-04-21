import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey } from '../utils/cms';

const About = () => {
  let { state, dispatch } = useContext(CMSContext);

  const content = getCmsRecordFromKey('request_form', state);

  return (
    <section className="grid-container usa-section" id="share">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8 usa-prose">
          <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
            {content.title}
          </h2>
          <p>
            <section id="request_form">
              <iframe className="airtable-embed airtable-dynamic-height" src={`https://airtable.com/embed/${content.body}`} frameBorder="0" onmousewheel="" width="100%" height="2316" />
            </section>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
