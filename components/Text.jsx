import Content from './Content';

const Text = ({ block }) => (<Content block={block}>
  <div className="grid-row grid-gap">
    {
      block.image && !block.data?.includes('image:right') &&
      <div className="tablet:grid-col-4">
        <img src={block.image} alt={block.alt}/>
      </div>
    }
    <div className="tablet:grid-col-12 usa-prose">
      <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
        {block.title}
      </h2>
      <div>
        {block.body_markdown}
      </div>
    </div>
    {
      block.image && block.data?.includes('image:right') &&
      <div className="tablet:grid-col-12">
        <img src={block.image} alt={block.alt} />
      </div>
    }
  </div>
</Content>
)

export default Text;