import Interweave from 'interweave';

const Text = ({ block }) => (<section className="grid-container usa-section">
  <div className="grid-row grid-gap">
    {
      block.image && block.data.includes('image:left') &&
      <div className="tablet:grid-col-4">
        <img src={block.image} />
      </div>
    }
    <div className="tablet:grid-col-8 usa-prose">
      <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
        {block.title}
      </h2>
      <div>
        {block.body_markdown}
      </div>
    </div>
    {
      block.image && block.data.includes('image:right') &&
      <div className="tablet:grid-col-4">
        <img src={block.image} />
      </div>
    }
  </div>
</section>
)



export default Text;