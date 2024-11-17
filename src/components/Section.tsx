import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TitleProps) => {
  return (
    <h2
      className={cn(
        'text-2xl uppercase text-center md:text-3xl font-bold text-gray-800 mb-2',
        className
      )}
    >
      {children}
    </h2>
  );
};

interface DescriptionProps {
  children: ReactNode;
  className?: string;
}

export const Description = ({ children, className }: DescriptionProps) => {
  return (
    <p
      className={cn(
        'text-md md:text-lg text-gray-600 max-w-2xl mx-auto',
        className
      )}
    >
      {children}
    </p>
  );
};

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export const Section = ({ id, className, children }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn('container mx-auto py-8 px-4 md:px-8', className)}
    >
      <div className="section-content">{children}</div>
    </section>
  );
};
