import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  highlightWord?: string; // Word in title to style with primary pink color
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'left',
  highlightWord,
  className,
  ...props
}: SectionTitleProps) {
  
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return <h2 className="text-2xl sm:text-3.5xl font-semibold tracking-tight text-text-primary">{title}</h2>;
    }

    const parts = title.split(highlightWord);
    return (
      <h2 className="text-2xl sm:text-3.5xl font-semibold tracking-tight text-text-primary">
        {parts[0]}
        <span className="text-primary font-bold">{highlightWord}</span>
        {parts[1]}
      </h2>
    );
  };

  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col mb-8 sm:mb-12',
          align === 'center' && 'items-center text-center',
          align === 'right' && 'items-end text-right'
        ),
        className
      )}
      {...props}
    >
      {subtitle && (
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-accent-gold mb-2 block">
          {subtitle}
        </span>
      )}
      {renderTitle()}
      <div 
        className={clsx(
          'h-[2px] w-12 bg-primary mt-4 rounded-full',
          align === 'center' && 'mx-auto',
          align === 'right' && 'ml-auto'
        )}
      />
    </div>
  );
}
