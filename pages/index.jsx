import React, { useContext } from 'react';
import Interweave from 'interweave';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey } from '../utils/cms';
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

  return (
    <>
      <section aria-label="Introduction" id="hero">
        <div className="usa-hero" style={{ backgroundImage: `url(${hero.image})` }}>
          <div className="grid-container">
            <div className="usa-hero__callout">
              <h1 className="usa-hero__heading">
                <span className="usa-hero__heading--alt">{hero.title}</span>
              </h1>
              <p>
                {hero.body}
              </p>
              {button_one.enabled && <Button href={button_one.href}>{button_one.body}</Button>}
              {button_two.enabled && <Button href={button_two.href}>{button_two.body}</Button>}
            </div>
          </div>
        </div>
      </section>
      <section className="grid-container usa-section">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-4">
            <h2 className="font-heading-xl margin-bottom-2 tablet:margin-bottom-2">
              {how.title}
            </h2>
          </div>
          <div className="tablet:grid-col-8 usa-prose">
            <div>
              <Interweave content={how.body} />
            </div>
          </div>
        </div>
      </section>
      <section className="usa-section usa-section--dark">
        <div className="grid-container">
          <h2 className="font-heading-xl margin-y-0">{cta.title}</h2>
          <Button href='/request' size='big'>{cta.body}</Button>
        </div>
      </section>
      <section className="grid-container usa-section" id="currently_serving">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-4">
            <img src={serving.image} />
          </div>
          <div className="tablet:grid-col-8 usa-prose">
            <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
              {serving.title}
            </h2>
            <div>
              <Interweave content={serving.body} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

HomePage.getLayout = getLayout;

export default HomePage;
