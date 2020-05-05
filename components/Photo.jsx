import Content from './Content';

const Photo = ({ block }) => (<Content block={block}>
  <img src={block.image} alt={block.alt} />
</Content>
)

export default Photo;