import Button from './Button';

/* Displays a single quote. */
const Quote = ({ block }) => (
  <section className="usa-section usa-section--dark">
    <div className="grid-container">
      <h2 className="font-heading-xl margin-y-0">{block.title}</h2>
      {block.href && <Button href={block.href} size='big'>{block.body}</Button>}
    </div>
  </section>
)

export default Quote;