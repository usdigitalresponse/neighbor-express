import Link from 'next/link';

const Button = ({ href, children, size = 'small' }) => {
  return <p><Link href={href}><a className={`usa-button usa-button--${size}`} href={href}>{children}</a></Link></p>
}

export default Button;