import React, { useContext } from 'react';
import cmsContext from '../context/cms';
import { getCmsRecordFromKey } from '../utils/cms';
import Interweave from 'interweave';
import { getLayout } from '../layouts/neighbor.jsx';

const HomePage = () => {
  const cms = useContext(cmsContext);
  const hero = getCmsRecordFromKey('hero', cms);
  const how = getCmsRecordFromKey('how_does_this_work', cms);
  const cta = getCmsRecordFromKey('cta', cms);
  const serving = getCmsRecordFromKey('currently_serving', cms);

  return <><section aria-label="Introduction" id="hero">
    <div class="usa-hero" style={{ backgroundImage: `url(${hero.image})` }}>
      <div class="grid-container">
        <div class="usa-hero__callout">
          <h1 class="usa-hero__heading">
            <span class="usa-hero__heading--alt">{hero.title}</span>
          </h1>
          <p>
            {hero.body_en}
          </p>
          <p>
            <a class="usa-button" href={hero.href}>{hero.secondary_en}</a>
          </p>
        </div>
      </div>
    </div>
  </section>
    <section class="grid-container usa-section">
      <div class="grid-row grid-gap">
        <div class="tablet:grid-col-4">
          <h2 class="font-heading-xl margin-bottom-2 tablet:margin-bottom-2">
            {how.title}
          </h2>
        </div>
        <div class="tablet:grid-col-8 usa-prose">
          <p>
            <Interweave content={how.body_en} />
          </p>
        </div>
      </div>
    </section>
    <section class="usa-section usa-section--dark">
      <div class="grid-container">
        <h2 class="font-heading-xl margin-y-0">{cta.title}</h2>
        <a class="usa-button usa-button--big" href="/request">{cta.body_en}</a>
      </div>
    </section>
    <section class="grid-container usa-section" id="currently_serving">
      <div class="grid-row grid-gap">
        <div class="tablet:grid-col-4">
          <img src={serving.image} />
        </div>
        <div class="tablet:grid-col-8 usa-prose">
          <h2 class="font-heading-xl margin-top-0 tablet:margin-bottom-0">
            {serving.title}
          </h2>
          <p>
            <Interweave content={serving.body_en} />
          </p>
        </div>
      </div>
    </section>
  </>
}

HomePage.getLayout = getLayout;

export default HomePage;