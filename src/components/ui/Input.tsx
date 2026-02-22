import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-base',
        'placeholder:text-zinc-400',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        'dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500',
        'transition-colors duration-200',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export { Input };
