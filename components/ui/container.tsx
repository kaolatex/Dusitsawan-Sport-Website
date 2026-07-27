import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clean?: boolean;
}

export default function Container({ children, className, clean = false, ...props }: ContainerProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'w-full mx-auto',
          clean ? '' : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
