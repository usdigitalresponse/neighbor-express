const Photo = ({ block }) => (<section className="grid-container usa-section">
  <div className="grid-row">
    <img src={block.image} alt={block.body} />
  </div>
</section>
)

export default Photo;