import Content from '@/components/Content';

const Photo = ({ block }) => (<Content block={block}>
  <div className="grid-row">
    <img src={block.image} alt={block.body} />
  </div>
</Content>
)

export default Photo;