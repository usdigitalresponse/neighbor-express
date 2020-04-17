import Interweave from 'interweave';

const Text = ({ block }) => (<section className="grid-container usa-section" id="share">
  <div className="grid-row grid-gap">
    <div className="tablet:grid-col-8 usa-prose">
      <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
        {block.title}
      </h2>
      <div>
        {block.body_markdown}
      </div>
    </div>
  </div>
</section>
)

export default Text;