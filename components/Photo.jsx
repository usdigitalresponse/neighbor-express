import Content from '@/components/Content';

const Photo = ({ block }) => (<Content block={block}>
  <div className="grid-row">
    <img src={block.image} alt={block.alt} />
  </div>
</Content>
)

export default Photo;