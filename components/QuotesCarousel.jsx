import Button from './Button';
import styles from './QuotesCarousel.module.css'
import { Carousel } from 'react-responsive-carousel';
const classNames = require('classnames');

const DELIMITER = '@@@';

/* Displays multiple quotes in a carousel.
 * Quotes data is split using DELIMITER. */
const QuotesCarousel = ({ block }) => {
  const quotes = block.title.split(DELIMITER);
  let quotesDiv;
  if (quotes.length > 1) {
    quotesDiv = (
      <Carousel className={`${styles.carousel}`}>
        {quotes.map((quote) => {
          return <h2 className="font-heading-xl">{quote}</h2>
        })}
      </Carousel>
    );
  } else {
    quotesDiv = <h2 className="font-heading-xl">{block.title}</h2>;
  }
  
  return <section className={`usa-section usa-section--dark ${styles.block}`}>
    <div className="grid-container">
      {quotesDiv}
      {block.href && <Button href={block.href} size='big'>{block.body}</Button>}
    </div>
  </section>
}

export default QuotesCarousel;