import Button from './Button';
import styles from './Quote.module.css'
import { Carousel } from 'react-responsive-carousel';
const classNames = require('classnames');

const DELIMITER = '@@@';

const Quote = ({ block }) => {
  const quotes = block.title.split(DELIMITER);
  
  return <section className="usa-section usa-section--dark">
    <div className="grid-container">
      <Carousel className={`${styles.carousel}`}>
        {quotes.map((quote) => {
          return <h2 className="font-heading-xl margin-y-0">{quote}</h2>
        })}
      </Carousel>
      {block.href && <Button href={block.href} size='big'>{block.body}</Button>}
    </div>
  </section>
}

export default Quote;