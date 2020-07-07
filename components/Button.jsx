import Link from 'next/link';

const Button = ({ href, children, size = 'small' }) => {
  const isRelativePath = href.trimLeft().startsWith('/');
  if (isRelativePath) {
    return <p>
      <Link href="/[pid]" as={href}>
        <a className={`usa-button usa-button--${size}`} href={href}>{children}
        </a>
      </Link>
    </p>
  } else {
    return <p>
      <a className={`usa-button usa-button--${size}`} href={href}>
        {children}
      </a>
    </p>
  } 
}

export default Button;