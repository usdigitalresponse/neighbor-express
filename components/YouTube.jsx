import Content from './Content';
import styles from './YouTube.module.css'

const YouTube = ({ block }) => {
  // regex the href so its foolproof
  // https://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
  const regexp = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/
  const match = regexp.exec(block.href);
  const youtube_id = match && match.length > 1 ? match[1] : "";
  
  return <Content block={block}>
    { block.title && <h2 className="font-heading-xl margin-y-0">{block.title}</h2> }
    { block.body_markdown && <div> {block.body_markdown} </div> }
    <div className={styles.videoContainer}>
      <div className="videoWrapper">
      	<iframe src={`https://www.youtube.com/embed/${youtube_id}`} frameBorder="0" allowFullScreen
      			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>
    </div>
    {/* https://css-tricks.com/fluid-width-video/ */}
    <style jsx>{`
      .videoWrapper {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0;
      }
      .videoWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `}</style>
  </Content>
}

export default YouTube;

