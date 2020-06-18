import Button from './Button';
import styles from './Quote.module.css'
const classNames = require('classnames');

const Quote = ({ block }) => {
  const blockClasses =
    classNames("usa-section", "usa-section--dark", styles.block);
  return (
    <section className={blockClasses}>
      <div className="grid-container">
        <h2 className="font-heading-xl margin-y-0">{block.title}</h2>
        {block.href && <Button href={block.href} size='big'>{block.body}</Button>}
      </div>
    </section>
  );
}

export default Quote;