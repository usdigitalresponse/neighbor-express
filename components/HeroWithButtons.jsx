import React, { useContext } from 'react';
import { CMSContext } from '../context/cms';
import { getCmsRecordFromKey } from '../utils/cms';
import Button from '@/components/Button';

const HeroWithButtons = ({ block }) => {
  let { state, dispatch } = useContext(CMSContext);
  const button_one = getCmsRecordFromKey('hero_button_one', state);
  const button_two = getCmsRecordFromKey('hero_button_two', state, false /*required*/);

  return <section aria-label="Introduction" id="hero">
    <div className="usa-hero" style={{ backgroundImage: `url(${block.image})` }}>
      <div className="grid-container">
        <div className="usa-hero__callout">
          <h1 className="usa-hero__heading">
            <span className="usa-hero__heading--alt">{block.title}</span>
          </h1>
          <p>
            {block.body}
          </p>
          {button_one?.enabled && <Button href={button_one.href}>{button_one.body}</Button>}
          {button_two?.enabled && <Button href={button_two.href}>{button_two.body}</Button>}
        </div>
      </div>
    </div>
  </section>
}

export default HeroWithButtons;