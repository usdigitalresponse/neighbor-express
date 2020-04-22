const Quote = ({ block }) => (
  <section className="usa-section usa-section--dark">
    <div className="grid-container">
      <h2 className="font-heading-xl margin-y-0">{block.body}</h2>
    </div>
  </section>
)

export default Quote;