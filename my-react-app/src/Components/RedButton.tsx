import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface RedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function RedButton({
  children,
  className = '',
  type = 'button',
  ...props
}: RedButtonProps) {
  return (
    <button
      type={type}
      className={`red-button ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default RedButton;
