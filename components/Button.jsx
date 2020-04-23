import Link from 'next/link';

const Button = ({ href, children, size = 'small' }) => {
  console.log(href);
  return <p>
    <Link href="/[pid]" as={href}>
      <a className={`usa-button usa-button--${size}`} href={href}>{children}
      </a>
    </Link>
  </p>
}

export default Button;