const Hero = ({ block }) => (<section aria-label="Introduction">
  <div className="usa-hero" style={{ backgroundImage: `url(${block.image})` }}>
    <div className="grid-container">
      <div className="usa-hero__callout">
        <h1 className="usa-hero__heading">
          <span className="usa-hero__heading--alt">{block.title}</span>
        </h1>
        <div>
          {block.body}
        </div>
      </div>
    </div>
  </div>
</section>
)

export default Hero;