var classNames = require('classnames');

const Content = ({block, children}) => {
	const classes = classNames("grid-container", {"usa-section": !block.compact})
	return <section aria-label={block.title} className={classes}>
		{children}
	</section>
}

export default Content;