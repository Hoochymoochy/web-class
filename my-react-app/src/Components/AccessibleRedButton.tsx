import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface AccessibleRedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function AccessibleRedButton({
  children,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: AccessibleRedButtonProps) {
  return (
    <button
      type={type}
      className={`red-button ${className}`.trim()}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </button>
  );
}

export default AccessibleRedButton;
